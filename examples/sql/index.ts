import { ExecSQL, GetDataByRID, Log, QuerySQL } from "@w3bstream/wasm-sdk";
import { Bool, Float64, Int32, Int64, String, Time } from "@w3bstream/wasm-sdk/assembly/sql";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const key = GetDataByRID(rid);
  const value = ExecSQL(`INSERT INTO "t_log" (f_id,f_log) VALUES (?,?);`, [new Int32(1), new String("test")]);
  const res = QuerySQL(`SELECT * FROM "t_log";`);
  Log("res" + res);
  return 0;
}
