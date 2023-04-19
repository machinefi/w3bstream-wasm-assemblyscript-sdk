import { GetDataByRID, GetDB, Log, SendTx, SetDB } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  SetDB("wordCount", 2);
  let value = GetDB("wordCount");
  if (value) {
    Log("wasm get value:" + value.toString());
  }
  return 0;
}
export function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void {}
