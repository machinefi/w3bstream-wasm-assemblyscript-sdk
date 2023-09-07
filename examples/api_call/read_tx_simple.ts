import { GetDataByRID, JSON, JSONEncoder, Log, } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";
import { encode, decode } from "as-base64/assembly/index";
import { ApiCall } from "../../assembly"
import { utf8ArrayToString } from "../../assembly/utility"

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  let data = ApiCall('{"Method":"GET","Url":"w3bstream://w3bstream.com/system/read_tx","Header":{"Eventtype":["result"]},"Body":"eyJjaGFpbklEIjogNDY5MCwiaGFzaCI6ICJmY2FmMzc3ZmYzY2M3ODVkNjBjNThkZTdlMTIxZDZhMmU3OWUxYzU4YzE4OWVhODY0MWYzZWE2MWY3NjA1Mjg1In0="}')
  Log(data)
  return 0;
}

export function handle_result(rid: i32): i32 {
  Log("handle_result");
  const message = GetDataByRID(rid);
  let messageJSON: JSON.Obj = JSON.parse(
    message
  ) as JSON.Obj;
  let body_base64: JSON.Str | null = messageJSON.getString("Body") as JSON.Str;
  if (body_base64) {
    let body = decode(body_base64.toString());
    let bodyString = utf8ArrayToString(body);
    Log("res:" + bodyString);
  }
  return 0;
}