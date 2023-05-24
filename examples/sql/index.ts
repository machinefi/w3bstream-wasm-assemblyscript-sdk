import { ExecSQL, GetDataByRID, Log, QuerySQL } from "@w3bstream/wasm-sdk";
import { Bool, Bytes, Float64, Int32, Int64, String, Time } from "@w3bstream/wasm-sdk/assembly/sql";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const key = GetDataByRID(rid);
  const bytes = generateMockUint8Array(10);
  const value = ExecSQL(`INSERT INTO "t_log" (f_id,f_json,f_timestamp,f_date,f_bytes) VALUES (?,?,?,?,?);`, [new Int32(1), new String('{"hello":"world"}'), new String("2023-01-01 13:21:59.258"), new String("2023-05-23"), new Bytes(bytes)]);
  const res = QuerySQL(`SELECT * FROM "t_log";`);
  Log("res" + res);
  return 0;
}

function generateMockUint8Array(length: number): Uint8Array {
  const arr = new Uint8Array(length as i32);
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * 256) as u32;
  }
  return arr;
}
