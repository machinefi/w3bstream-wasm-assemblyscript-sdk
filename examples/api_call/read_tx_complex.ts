import { GetDataByRID, JSON, JSONEncoder, Log, ApiCall } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";
import { encode, decode } from "as-base64/assembly/index";
import { utf8ArrayToString } from "@w3bstream/wasm-sdk/assembly/utility"

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  let bodyEncode = new JSONEncoder();
  bodyEncode.pushObject("");
  bodyEncode.setInteger('chainID', 4690);
  bodyEncode.setString('hash', 'fcaf377ff3cc785d60c58de7e121d6a2e79e1c58c189ea8641f3ea61f7605285');
  bodyEncode.popObject();

  let encoder = new JSONEncoder();
  encoder.pushObject("");
  encoder.setString('Method', 'GET');
  encoder.setString('Url', 'w3bstream://w3bstream.com/system/read_tx');
  encoder.pushObject("Header");
  encoder.pushArray("Eventtype");
  encoder.setString("", "result");
  encoder.popArray();
  encoder.popObject();
  encoder.setString("Body", encode(bodyEncode.serialize()))
  encoder.popObject();

  Log('encoder:' + encoder.toString())
  // > '{"Method":"GET","Url":"w3bstream://w3bstream.com/system/read_tx","Header":{"Eventtype":["result"]},"Body":"eyJjaGFpbklEIjogNDY5MCwiaGFzaCI6ICJmY2FmMzc3ZmYzY2M3ODVkNjBjNThkZTdlMTIxZDZhMmU3OWUxYzU4YzE4OWVhODY0MWYzZWE2MWY3NjA1Mjg1In0="}'
  let data = ApiCall(encoder.toString())
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