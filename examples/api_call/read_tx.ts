import { Log, GetDataByRID, HTTP } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";
export function start(rid: i32): i32 {
  HTTP.readTx("iotex-testnet", "fcaf377ff3cc785d60c58de7e121d6a2e79e1c58c189ea8641f3ea61f7605285")
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