import { Abort, GetDataByRID, Log } from "../../assembly/index";
export { alloc } from "../../assembly/index"

export function start(rid: i32): i32 {
    Log("start from typescript");
    const message = GetDataByRID(rid);
    Abort("test Abort", "abort/index.ts", 6, 7);
    Log("wasm received message:" + message);
    return 0;
}
