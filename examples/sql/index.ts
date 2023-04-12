import { ExecSQL, GetDataByRID, Log } from "@w3bstream/wasm-sdk";
import { Bool, Float64, Int32, Int64, String, Time } from "@w3bstream/wasm-sdk/assembly/sql";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  Log("start from typescript");
  const key = GetDataByRID(rid);
  const value = ExecSQL(`INSERT INTO "t_mint_nft" (f_id,f_address,f_int64,f_float64,f_bool) VALUES (?,?,?,?,?);`, [new Int32(1), new String("test"), new Int64(10000), new Float64(0.2511), new Bool(true)]);
  return 0;
}
