import { GetDataByRID, Log } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): string {
  const message = GetDataByRID(rid);
  Log("Hello World Applet executed. Received message:" + message);
  return "123123";
}
