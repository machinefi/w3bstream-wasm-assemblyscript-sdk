import { CallContract, GetDataByRID, Log, SendTx } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  const ERC20Addr = `0xb73eE6EB5b1984c78CCcC49eA7Ad773E71d74F51`;
  const account = `9117f5EF4156709092f79740a97b1638cA399A00`;
  const res = SendTx(
    4690,
    ERC20Addr,
    "0",
    `40c10f19000000000000000000000000${account}00000000000000000000000000000000000000000000000000000000000f4240`
  );
  Log("wasm send tx result:" + res);
  return 0;
}

