import { GetDataByRID, JSON, Log, SendTx } from "@w3bstream/wasm-sdk";
import { ethToHex, buildTxSlot, buildTxString } from "@w3bstream/wasm-sdk/assembly/utility";

export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
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
    const amountToMint = "10";

    const res = mintTokens(
      chainIdOrNull.valueOf() as i32, 
      ERC20Address.valueOf(), 
      MintTo.valueOf(), 
      amountToMint
    );

    Log("wasm send tx result:" + res);
  } else {
    Log(`params invalid`);
  }
  return 0;
}

export function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void { }

function mintTokens<T>(chainId: i32, contractAddress: string, recipient: string, amount: T): string {
  const MINT_FUNCTION_ADDR = "40c10f19";
  const txData = buildTxData(MINT_FUNCTION_ADDR, recipient, amount);

  return SendTx(
    chainId,
    contractAddress,
    "0",
    txData
  );
}

function buildTxData<T>(
  functionAddr: string,
  recipient: string,
  tokenAmount: T
): string {
  const slotForRecipient = buildTxSlot(recipient.replace("0x", ""));
  const slotForAmount = tokenNumberToTxSlot(tokenAmount);

  return buildTxString([functionAddr, slotForRecipient, slotForAmount]);
}

function tokenNumberToTxSlot<T>(value: T): string {
  const ethHex = ethToHex(value);
  return buildTxSlot(ethHex);
}
