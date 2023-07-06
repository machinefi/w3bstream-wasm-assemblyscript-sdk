import { GetDataByRID, Log, SubmitMetrics } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  SubmitMetrics('{"name": "jone","age": 28}');
  return 0;
}
