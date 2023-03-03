// import { GetDataByRID } from "../../assembly";
// @ts-ignore: decorator
@external("env", "abort")
  declare function abort(message: usize ,fileName: usize ,lineNumber: u32,columnNumber: u32): void
// @ts-ignore: decorator
@external("env", "Log")
  declare function Log(message:string): i32

export function start(rid: i32): i32 {
  Log("Log:start from typescript");
  // const message = GetDataByRID(rid);
  // Log("wasm received message:");
  assert(false,"ERROR:This is test abort message>>>")
  return rid;
}

