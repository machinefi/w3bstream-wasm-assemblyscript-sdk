@external("env", "ws_log")
declare function ws_log(logLevel:u8, ptr: usize, size: usize): i32

@external("env", "ws_set_db")
declare function ws_set_db(key_ptr:usize,ket_size:i32,return_ptr: usize,return_size:i32): i32

@external("env", "ws_get_db")
declare function ws_get_db(addr:usize,size:usize,rAddr:usize,rSize:u32): i32

@external("env", "ws_get_data")
declare function ws_get_data(rid: i32, data_ptr: usize , size_ptr:usize): i32

@external("env", "ws_set_data")
declare function ws_set_data(rid: i32, ptr: usize , size:u32): i32

@external("env", "ws_send_tx")
declare function ws_send_tx(ptr: usize , size:u32): i32

export function Log(message: string):i32 {
    let strEncoded = String.UTF8.encode(message, true);
    let message_ptr = changetype<usize>(strEncoded);
    let message_size = strEncoded.byteLength - 1;
    ws_log(3, message_ptr, message_size); // logInfoLevel = 3
    return 0;
};

export function SetDB(key: string, value: i32):i32 {
    let keyEncoded = String.UTF8.encode(key, true);
    let key_ptr = changetype<usize>(keyEncoded);
    let key_size = keyEncoded.byteLength - 1;
    let valueEncoded = String.UTF8.encode(value.toString(), true);
    let value_ptr = changetype<usize>(valueEncoded);
    let value_size = valueEncoded.byteLength - 1;
    ws_set_db(key_ptr, key_size, value_ptr, value_size);
    return 0;
}

export function GetDB(key: string):string {
    //key to ptr
    let keyEncoded = String.UTF8.encode(key, true);
    let key_ptr = changetype<usize>(keyEncoded);
    let key_size = keyEncoded.byteLength - 1;

    let rAddr = heap.alloc(sizeof<u32>());
    let rSize = heap.alloc(sizeof<u32>());

    let code = ws_get_db(key_ptr, key_size, rAddr, rSize);
    if(code != 0){
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
    let code = ws_get_data(rid, memory_ptr , size_ptr);
    if(code == 0){
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

export function SendTx(tx: string):i32 {
    let txEncoded = String.UTF8.encode(tx, true);
    let tx_ptr = changetype<usize>(txEncoded);
    let tx_size = txEncoded.byteLength - 1;
    return ws_send_tx(tx_ptr, tx_size);
}

