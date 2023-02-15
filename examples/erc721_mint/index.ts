import { GetDataByRID, JSON, Log, SendTx } from "../../assembly/index";
export { alloc } from "../../assembly/index";

export function start(rid: i32): i32 {
  Log("start from typescript");
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);

  let jsonObj: JSON.Obj = JSON.parse(message) as JSON.Obj;
  // payload like {
  //   "chainId": 4690,
  //   "address":"0x4BF7916893DfA78834B2F8B535654682d36e1163",
  //   "mintTo":"0x9117f5EF4156709092f79740a97b1638cA399A00"
  // }
  let chainIdOrNull: JSON.Integer | null = jsonObj.getInteger("chainId");
  let ERC20Address: JSON.Str | null = jsonObj.getString("address");
  let MintTo: JSON.Str | null = jsonObj.getString("mintTo");
  if (chainIdOrNull && ERC20Address && MintTo) {
    const res = SendTx(
      4690,
      ERC20Address.valueOf(),
      "0",
      `
    6a627842000000000000000000000000${MintTo.valueOf().replace("0x", "")}`
    );
    Log("wasm send tx result:" + res);
  } else {
    Log(`params invalid`);
  }
  return 0;
}
