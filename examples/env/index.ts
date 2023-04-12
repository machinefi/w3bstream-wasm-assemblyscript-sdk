import { Abort, GetDataByRID, GetEnv, Log } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  Log("start from typescript");
  const key = GetDataByRID(rid);
  Log("wasm received env key:" + key);
  const value = GetEnv(key);
  Log(`get env from host by key: ${key}, value: ${value}`);
  return 0;
}
