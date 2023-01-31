

import { ExecSQL, GetDataByRID, Log } from "../../assembly/index";
import { Int32 } from "../../assembly/sql";
export { alloc } from "../../assembly/index"

export function start(rid: i32): i32 {
  Log("start from typescript");
  const key = GetDataByRID(rid);
  const v = new Map<string, i32>()
  v.set("int32", 1)
  const value = ExecSQL(`INSERT INTO "f_table" (f_id,f_gender) VALUES (?,?);`, [v,v]);
  return 0;
}
