import { GetDataByRID, Log, JSON } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

//sdk docs:https://github.com/machinefi/w3bstream-wasm-ts-sdk
export function start(rid: i32): i32 {
  let jsonObj: JSON.Obj = <JSON.Obj>JSON.parse('{"hello": "world", "value": 24}');
  let worldOrNull: JSON.Str | null = jsonObj.getString("hello"); // This will return a JSON.Str or null
  if (worldOrNull != null) {
    let world: string = worldOrNull.valueOf();
    Log(world);
  }

  let numOrNull: JSON.Integer | null = jsonObj.getInteger("value");
  Log("test000000");
  if (numOrNull != null) {
    Log("test1111111")
    let value: i64 = numOrNull.valueOf();
    Log(value.toString());
  }

  return rid;
}
