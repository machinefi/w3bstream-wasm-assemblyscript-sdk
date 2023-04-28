import { CallContract, GetDataByRID, Log, SendTx } from "@w3bstream/wasm-sdk";
import { hexToAddress, hexToBool, hexToUtf8 } from "@w3bstream/wasm-sdk/assembly/utility";

export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  const ERC20Addr = "0xa00744882684c3e4747faefd68d283ea44099d03";
  const balanceOfHex = CallContract(4689, ERC20Addr, `0x70a082310000000000000000000000009117f5ef4156709092f79740a97b1638ca399a00`);

  Log("balanceOfHex:" + balanceOfHex);
  Log("balanceOfInt:" + parseInt(balanceOfHex, 16).toString());

  const symbolHex = CallContract(4689, ERC20Addr, `0x95d89b41`);
  Log("symbolHex:" + symbolHex);
  Log("symbol:" + hexToUtf8(symbolHex));

  //if return type is 'bool'
  //use hexToBool

  //if return type is 'address'
  //use hexToAddress
  return 0;
}
