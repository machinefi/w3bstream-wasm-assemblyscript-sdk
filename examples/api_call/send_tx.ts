import { Log, GetDataByRID, HTTP } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";
export function start(rid: i32): i32 {
  HTTP.sendTx("iotex-testnet", "default", "0x9117f5EF4156709092f79740a97b1638cA399A00", "10000000000000000000", "0x")
  return 0;
}

export function handle_result(rid: i32): i32 {
  const message = GetDataByRID(rid);
  Log(HTTP.parseResult(message))
  return 0;
}


// export function handle_result(rid: i32): i32 {
//   const message = GetDataByRID(rid);
//   let messageJSON: JSON.Obj = JSON.parse(
//     message
//   ) as JSON.Obj;
//   let body_base64: JSON.Str | null = messageJSON.getString("Body") as JSON.Str;
//   if (body_base64) {
//     let body = decode(body_base64.toString());
//     let bodyString = utf8ArrayToString(body);
//     Log("res:" + bodyString);
//   }
//   return 0;
// }