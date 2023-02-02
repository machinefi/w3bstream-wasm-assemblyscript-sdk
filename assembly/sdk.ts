import { JSON, JSONEncoder } from ".";
import { dBQuery, SQLTypes } from "./sql";

@external("env", "ws_log")
  declare function ws_log(logLevel: u8, ptr: usize, size: usize): i32

@external("env", "ws_set_db")
  declare function ws_set_db(key_ptr: usize, ket_size: i32, return_ptr: usize, return_size: i32): i32

@external("env", "ws_get_db")
  declare function ws_get_db(addr: usize, size: usize, rAddr: usize, rSize: u32): i32

@external("env", "ws_get_data")
  declare function ws_get_data(rid: i32, data_ptr: usize, size_ptr: usize): i32

@external("env", "ws_set_data")
  declare function ws_set_data(rid: i32, ptr: usize, size: u32): i32

@external("env", "ws_send_tx")
  // declare function ws_send_tx(ptr: usize, size: u32): i32
  declare function ws_send_tx(chainID: i32, offset: usize, size: usize, vmAddrPtr: usize, vmSizePtr: usize): i32

@external("env", "ws_get_env")
  declare function ws_get_env(kaddr: usize, ksize: usize, vaddr: usize, vsize: usize): i32

@external("env", "ws_set_sql_db")
  declare function ws_set_sql_db(ptr: usize, size: u32): i32

@external("env", "ws_get_sql_db")
  declare function ws_get_sql_db(ptr: usize, size: u32, rAddr: u32, rSize: usize): i32

export {
  JSON,
  JSONEncoder,
} from "../node_modules/assemblyscript-json/assembly/index";


export function ExecSQL(query: string, args: Map<string, i32>[]): i32 {
  // const params = args.map(v => v.getParam());
  // const dbQuery = { Statement: query, Params: args };
  //{ Statement: query, Params: [{Int32:12}] }
  let encoder = new JSONEncoder();
  encoder.pushObject(null)
  encoder.setString("statement", query);
  encoder.pushArray("params");
  for (let i = 0; i < args.length; i++) {
    const param: Map<string, i32> = args[i];
    encoder.pushObject(null)
    encoder.setInteger("int32", param.get('int32'))
    encoder.popObject()
  }
  encoder.popArray();
  encoder.popObject();
  let serializedQuery = encoder.serialize();
  let string = encoder.toString()
  Log(`serializedQuery: ${serializedQuery.buffer}`);
  Log(`${string}`)
  let key_ptr = changetype<usize>(serializedQuery.buffer);
  Log(`key_ptr: ${key_ptr} key_size: ${serializedQuery.length}`)
  const ret = ws_set_sql_db(key_ptr, serializedQuery.length);
  Log(`ret: ${ret}`)
  if (ret !== 0) {
    Log("fail to execute the sql query");
  }
  return 0;
}

export function GetSQLDB(querySQL: string): string {
  //key to ptr
  let keyEncoded = String.UTF8.encode(querySQL, true);
  let ptr = changetype<usize>(keyEncoded);
  let size = keyEncoded.byteLength - 1;

  let rAddr = heap.alloc(sizeof<u32>());
  let rSize = heap.alloc(sizeof<u32>());

  let code = ws_get_sql_db(ptr, size, rAddr, rSize);
  if (code != 0) {
    return "";
  }
  let rAddrValue = load<u32>(rAddr);
  let rAddrSize = load<u32>(rSize);
  let data = String.UTF8.decodeUnsafe(rAddrValue, rAddrSize, true);
  heap.free(rAddr);
  heap.free(rSize);
  return data;
}


export function GetEnv(key: string): string {
  let kstrEncoded = String.UTF8.encode(key, true);
  let kaddr = changetype<usize>(kstrEncoded);
  let ksize = kstrEncoded.byteLength - 1;

  let vaddr: usize = heap.alloc(sizeof<u32>());
  let vsize: usize = heap.alloc(sizeof<u32>());

  let code = ws_get_env(kaddr, ksize, vaddr, vsize);

  if (code != 0) {
    Log(`get env failed: key: ${key} code: ${code}`);
    return "";
  }

  let m = load<u32>(vaddr);
  let mSize = load<u32>(vsize);
  if (!m) {
    Log(`get env failed: key: ${key} addr: ${vaddr}`);
    return "";
  }
  heap.free(vaddr);
  heap.free(vsize);
  return String.UTF8.decodeUnsafe(m, mSize, true);
}

export function Log(message: string): i32 {
  let strEncoded = String.UTF8.encode(message, true);
  let message_ptr = changetype<usize>(strEncoded);
  let message_size = strEncoded.byteLength - 1;
  ws_log(3, message_ptr, message_size); // logInfoLevel = 3
  return 0;
}

export function SetDB(key: string, value: i32): i32 {
  let keyEncoded = String.UTF8.encode(key, true);
  let key_ptr = changetype<usize>(keyEncoded);
  let key_size = keyEncoded.byteLength - 1;
  let valueEncoded = String.UTF8.encode(value.toString(), true);
  let value_ptr = changetype<usize>(valueEncoded);
  let value_size = valueEncoded.byteLength - 1;
  ws_set_db(key_ptr, key_size, value_ptr, value_size);
  return 0;
}

export function GetDB(key: string): string {
  //key to ptr
  let keyEncoded = String.UTF8.encode(key, true);
  let key_ptr = changetype<usize>(keyEncoded);
  let key_size = keyEncoded.byteLength - 1;

  let rAddr = heap.alloc(sizeof<u32>());
  let rSize = heap.alloc(sizeof<u32>());

  let code = ws_get_db(key_ptr, key_size, rAddr, rSize);
  if (code != 0) {
    return "";
  }
  let rAddrValue = load<u32>(rAddr);
  let rAddrSize = load<u32>(rSize);
  let data = String.UTF8.decodeUnsafe(rAddrValue, rAddrSize, true);
  heap.free(rAddr);
  heap.free(rSize);
  return data;
}

export function GetDataByRID(rid: i32): string {
  let memory_ptr = heap.alloc(sizeof<u32>());
  let size_ptr = heap.alloc(sizeof<u32>());
  //todo fix bugmemory_ptr
  let code = ws_get_data(rid, memory_ptr, size_ptr);
  if (code == 0) {
    let data_ptr = load<u32>(memory_ptr);
    let data_size = load<u32>(size_ptr);
    let data = String.UTF8.decodeUnsafe(data_ptr, data_size, true);
    //gc
    heap.free(data_ptr);
    heap.free(size_ptr);
    return data;
  }
  return "";
}

export function SendTx(chainId: i32, tx: string): string {
  let txEncoded = String.UTF8.encode(tx, true);
  let tx_ptr = changetype<usize>(txEncoded);
  let tx_size = txEncoded.byteLength - 1;

  let vmAddrPtr = heap.alloc(sizeof<u32>());
  let vmSizePtr = heap.alloc(sizeof<u32>());

  const ret = ws_send_tx(chainId, tx_ptr, tx_size, vmAddrPtr, vmSizePtr);

  let vmAddr = load<u32>(vmAddrPtr);
  let vmSize = load<u32>(vmSizePtr);

  let vm = String.UTF8.decodeUnsafe(vmAddr, vmSize, true);

  heap.free(vmAddrPtr);
  heap.free(vmSizePtr);

  return vm;
}

