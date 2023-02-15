import { GetDataByRID, Log } from "../../assembly/index";
export { alloc } from "../../assembly/index";

export function start(rid: i32): string {
  Log("start from typescript");
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  return "123123";
}
