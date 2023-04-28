import { CallContract, GetDataByRID, Log, SendTx, hexToBool, hexToUtf8 } from "../../assembly";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  Log("wasm received message2:" + message);
  const ERC20Addr = "0x80efBd5CfC900204aD638BC75C434CDcF825A13d";
  const account = `9117f5EF4156709092f79740a97b1638cA399A00`;
  const balanceOfHex = CallContract(4690, ERC20Addr, `0x70a082310000000000000000000000009117f5ef4156709092f79740a97b1638ca399a00`);
  Log("balanceOfHex:" + balanceOfHex);
  Log("balanceOfInt:" + parseInt(balanceOfHex, 16).toString());

  const symbolHex = CallContract(4690, ERC20Addr, `0x95d89b41`);
  Log("symbolHex:" + symbolHex);
  Log("symbol:" + hexToUtf8(symbolHex));
  const getTrueOrFalse = CallContract(4690, ERC20Addr, `0xfd9cec4b`);
  Log("getTrueOrFalse:" + getTrueOrFalse);
  Log("getTrueOrFalse:" + hexToBool(getTrueOrFalse).toString());
  return 0;
}
