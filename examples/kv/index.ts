import { Bytes } from "@w3bstream/wasm-sdk/assembly/database";
import { GetDataByRID, GetDB, Log, SendTx, SetDB } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  kv_string();
  kv_i32();
  kv_i64();
  kv_u32();
  kv_u64();
  kv_float32();
  kv_float64();
  kv_bool();
  return 0;
}

function kv_string(): i32 {
  SetDB("string", Bytes.fromString("hello world"));
  let value = GetDB("string");
  if (value) {
    Log("wasm get value:" + Bytes.toString(value));
  }
  return 0;
}

function kv_i32(): i32 {
  SetDB("i32", Bytes.fromInt32(-2147483648));
  let value = GetDB("i32");
  if (value) {
    Log("wasm get value:" + Bytes.toInt32(value).toString());
  }
  return 0;
}

function kv_i64(): i64 {
  SetDB("i64", Bytes.fromInt64(-9223372036854775808));
  let value = GetDB("i64");
  if (value) {
    Log("wasm get value:" + Bytes.toInt64(value).toString());
  }
  return 0;
}

function kv_u32(): i32 {
  SetDB("u32", Bytes.fromUint32(4294967295));
  let value = GetDB("u32");
  if (value) {
    Log("wasm get value:" + Bytes.toUint32(value).toString());
  }
  return 0;
}

function kv_u64(): i64 {
  SetDB("u64", Bytes.fromUint64(1844674407370955161));
  let value = GetDB("u64");
  if (value) {
    Log("wasm get value:" + Bytes.toUint64(value).toString());
  }
  return 0;
}

function kv_float32(): i32 {
  SetDB("float32", Bytes.fromFloat32(3.1415926));
  let value = GetDB("float32");
  if (value) {
    Log("wasm get value:" + Bytes.toFloat32(value).toString());
  }
  return 0;
}

function kv_float64(): i32 {
  SetDB("float64", Bytes.fromFloat64(3.141592653589793));
  let value = GetDB("float64");
  if (value) {
    Log("wasm get value:" + Bytes.toFloat64(value).toString());
  }
  return 0;
}

function kv_bool(): i32 {
  SetDB("bool", Bytes.fromBool(true));
  let value = GetDB("bool");
  if (value) {
    Log("wasm get value:" + Bytes.toBool(value).toString());
  }
  return 0;
}
