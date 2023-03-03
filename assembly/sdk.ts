import { JSON, JSONEncoder } from ".";
import {  SQLTypes } from "./sql";

// @ts-ignore: decorator
@external("env", "abort")
  declare function abort(message: usize ,fileName: usize ,lineNumber: u32,columnNumber: u32): void
// @ts-ignore: decorator
@external("env", "ws_log")
  declare function ws_log(logLevel: u8, ptr: usize, size: usize): i32
// @ts-ignore: decorator
@external("env", "ws_set_db")
  declare function ws_set_db(key_ptr: usize, ket_size: i32, return_ptr: usize, return_size: i32): i32
// @ts-ignore: decorator
@external("env", "ws_get_db")
  declare function ws_get_db(addr: usize, size: usize, rAddr: usize, rSize: usize): i32
// @ts-ignore: decorator
@external("env", "ws_get_data")
  declare function ws_get_data(rid: i32, data_ptr: usize, size_ptr: usize): i32
// @ts-ignore: decorator
@external("env", "ws_set_data")
  declare function ws_set_data(rid: i32, ptr: usize, size: u32): i32
  // @ts-ignore: decorator
  @external("env", "ws_get_env")
  declare function ws_get_env(kaddr: usize, ksize: usize, vaddr: usize, vsize: usize): i32
  // @ts-ignore: decorator
  @external("env", "ws_set_sql_db")
  declare function ws_set_sql_db(ptr: usize, size: u32): i32
  // @ts-ignore: decorator
  @external("env", "ws_get_sql_db")
  declare function ws_get_sql_db(ptr: usize, size: u32, rAddr: u32, rSize: usize): i32
  // @ts-ignore: decorator
  @external("env", "ws_send_tx")
  // declare function ws_send_tx(ptr: usize, size: u32): i32
  declare function ws_send_tx(chainID: i32, offset: usize, size: usize, vmAddrPtr: usize, vmSizePtr: usize): i32
  // @ts-ignore: decorator
  @external("env", "ws_call_contract")
  declare function ws_call_contract(chainID: i32, offset: usize, size: usize, vmAddrPtr: usize, vmSizePtr: usize): i32

export {
  JSON,
  JSONEncoder,
} from "assemblyscript-json/assembly/index";


export function Abort(message: string, fileName: string, lineNumber: u32, columnNumber: u32): void {
  let messageEncoded = String.UTF8.encode(message, false);
  let fileNameEncoded = String.UTF8.encode(fileName, false);
  let message_ptr = changetype<usize>(messageEncoded);
  let fileName_ptr = changetype<usize>(fileNameEncoded);
  abort(message_ptr,fileName_ptr,lineNumber,columnNumber);
}

export function ExecSQL(query: string, args: SQLTypes[]): i32 {
  let encoder = new JSONEncoder();
  encoder.pushObject(null)
  encoder.setString("statement", query);
  encoder.pushArray("params");
  for (let i = 0; i < args.length; i++) {
    const param: SQLTypes = args[i];
    encoder.pushObject(null)
    param.pushSQLType(encoder);
    encoder.popObject()
  }
  encoder.popArray();
  encoder.popObject();
  let serializedQuery = encoder.serialize();
  let string = encoder.toString()
  Log(string)
  let key_ptr = changetype<usize>(serializedQuery.buffer);
  const ret = ws_set_sql_db(key_ptr, serializedQuery.length);
  if (ret !== 0) {
    assert(false, "fail to execute the sql query");
  }

  return 0;
}

export function GetSQLDB(querySQL: string): string {
  //key to ptr
  let keyEncoded = String.UTF8.encode(querySQL, false);
  let ptr = changetype<usize>(keyEncoded);
  let size = keyEncoded.byteLength;

  let rAddr = heap.alloc(sizeof<u32>());
  let rSize = heap.alloc(sizeof<u32>());

  let code = ws_get_sql_db(ptr, size, rAddr, rSize);
  if (code != 0) {
    assert(false, `GetSQLDB failed`);
  }
  let rAddrValue = load<u32>(rAddr);
  let rAddrSize = load<u32>(rSize);
  let data = String.UTF8.decodeUnsafe(rAddrValue, rAddrSize, true);
  heap.free(rAddr);
  heap.free(rSize);
  return data;
}


export function GetEnv(key: string): string {
  let kstrEncoded = String.UTF8.encode(key, false);
  let kaddr = changetype<usize>(kstrEncoded);
  let ksize = kstrEncoded.byteLength;

  let vaddr: usize = heap.alloc(sizeof<u32>());
  let vsize: usize = heap.alloc(sizeof<u32>());

  let code = ws_get_env(kaddr, ksize, vaddr, vsize);

  if (code != 0) {
    assert(false, `get env failed: key: ${key} addr: ${vaddr}`);
    return "";
  }

  let m = load<u32>(vaddr);
  let mSize = load<u32>(vsize);
  if (!m) {
    assert(false, `get env failed: key: ${key} addr: ${vaddr}`);
    return "";
  }
  heap.free(vaddr);
  heap.free(vsize);
  return String.UTF8.decodeUnsafe(m, mSize, true);
}

export function Log(message: string): i32 {
  let strEncoded = String.UTF8.encode(message, false);
  let message_ptr = changetype<usize>(strEncoded);
  let message_size = strEncoded.byteLength;
  ws_log(3, message_ptr, message_size); // logInfoLevel = 3
  return 0;
}

export function SetDB(key: string, value: i32): i32 {
  let keyEncoded = String.UTF8.encode(key, false);
  let key_ptr = changetype<usize>(keyEncoded);
  let key_size = keyEncoded.byteLength;
  let valueEncoded = String.UTF8.encode(value.toString(), false);
  let value_ptr = changetype<usize>(valueEncoded);
  let value_size = valueEncoded.byteLength;
  ws_set_db(key_ptr, key_size, value_ptr, value_size);
  return 0;
}

export function GetDB(key: string): string | null {
  //key to ptr
  let keyEncoded = String.UTF8.encode(key, false);
  let key_ptr = changetype<usize>(keyEncoded);
  let key_size = keyEncoded.byteLength;

  let rAddr = heap.alloc(sizeof<u32>());
  let rSize = heap.alloc(sizeof<u32>());

  let code = ws_get_db(key_ptr, key_size, rAddr, rSize);
  if (code != 0) {
      return null
      // assert(false, "GetDB failed");
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

export function SendTx(chainId: i32, to:string, value:string ,data:string): string {
  let tx = `
  {
      "to": "${to}",
      "value": "${value}",
      "data": "${data.replace('0x','')}"
  }`
  Log(tx)
  let txEncoded = String.UTF8.encode(tx, false);
  let tx_ptr = changetype<usize>(txEncoded);
  let tx_size = txEncoded.byteLength;

  let vmAddrPtr = heap.alloc(sizeof<u32>());
  let vmSizePtr = heap.alloc(sizeof<u32>());

  const ret = ws_send_tx(chainId, tx_ptr, tx_size, vmAddrPtr, vmSizePtr);

  if(ret!=0) {
    assert(false, "send tx failed");
  }

  let vmAddr = load<u32>(vmAddrPtr);
  let vmSize = load<u32>(vmSizePtr);

  let vm = String.UTF8.decodeUnsafe(vmAddr, vmSize, true);

  heap.free(vmAddrPtr);
  heap.free(vmSizePtr);

  return vm;
}

export function CallContract(chainId:i32,to:string,data:string):string {
  let tx = `
  {
      "to": "${to}",
      "data": "${data.replace('0x','')}"
  }`
  let txEncoded = String.UTF8.encode(tx, false);
  let tx_ptr = changetype<usize>(txEncoded);
  let tx_size = txEncoded.byteLength;

  let vmAddrPtr = heap.alloc(sizeof<u32>());
  let vmSizePtr = heap.alloc(sizeof<u32>());

  const ret = ws_call_contract(chainId, tx_ptr, tx_size, vmAddrPtr, vmSizePtr);

  if(ret!=0) {
    assert(false, "send tx failed");
  }

  let vmAddr = load<u32>(vmAddrPtr);
  let vmSize = load<u32>(vmSizePtr);

  let vm = String.UTF8.decodeUnsafe(vmAddr, vmSize, true);

  heap.free(vmAddrPtr);
  heap.free(vmSizePtr);

  return vm;
}
