import { GetDataByRID, GetEnv, Log } from "../../assembly/index";
export { alloc } from "../../assembly/index"

export function start(rid: i32): i32 {
    Log("start from typescript");
    const key = GetDataByRID(rid);
    Log("wasm received env key:" + key);
    const value = GetEnv(key);
    Log(`get env from host by key: ${key}, value: ${value}`);
    return 0;
}
