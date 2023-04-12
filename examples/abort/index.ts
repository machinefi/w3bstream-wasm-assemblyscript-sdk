import { GetDataByRID, Log } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): string {
  Log("start from typescript");
  const message = GetDataByRID(rid);
  assert(false, "test assert222");
  Log("wasm received message:" + message);
  return "123";
}
