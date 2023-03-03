import { GetDataByRID, GetDB, Log, SendTx, SetDB } from "../../assembly/index";
export { alloc } from "../../assembly/index";

export function start(rid: i32): i32 {
  Log("start from typescript");
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  // let word = message.split("");
  SetDB("wordCount", 2);
  let value = GetDB("wordCount");
  Log("wasm get value:" + (value && value.toString()));
  return 0;
}
export function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void {}
