import { Log, GetDataByRID, HTTP } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";
export function start(rid: i32): i32 {
  HTTP.genZkProof(
    "3145991386, 3471678490, 3632776032, 2595288688, 1478438623, 4259749138, 987879707, 1456846509",
    "16",
    "4,30",
    "Stark",
    'handle_result'
  )
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