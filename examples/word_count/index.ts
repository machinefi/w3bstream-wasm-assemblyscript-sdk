import { GetDataByRID, GetDB, Log, SendTx, SetDB } from "../../assembly/index";

export function start(rid: i32): i32 {
    Log("start from typescript");
    const message = GetDataByRID(rid);
    Log("wasm received message:" + message);
    let word = message.split("");
    SetDB("wordCount", word.length);
    let value = GetDB("wordCount");
    Log("wasm get value:" + value.toString());
    return 0;
}
