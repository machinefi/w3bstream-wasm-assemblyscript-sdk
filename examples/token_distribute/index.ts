import { GetDataByRID, Log, SendTx } from "../../assembly/index";
export { alloc } from "../../assembly/index"

export function start(rid: i32): i32 {
  Log("start from typescript");
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  const ERC20Addr = `0xb73eE6EB5b1984c78CCcC49eA7Ad773E71d74F51`;
  const account = `9117f5EF4156709092f79740a97b1638cA399A00`;
  const res = SendTx(4690, `
    {
        "to": "${ERC20Addr}",
        "value": "0",
        "data": "40c10f19000000000000000000000000${account}0000000000000000000000000000000000000000000000000de0b6b3a7640000"
    }`);
  Log("wasm send tx result:" + res)
  return 0;
}
