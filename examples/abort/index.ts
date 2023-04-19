import { GetDataByRID, Log } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  assert(false, "test assert");
  Log("wasm received message:" + message);
  return 0;
}
