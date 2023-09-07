import { u128 } from "as-bignum/assembly";
import Big from "as-big";

export function hexToInt(hexString: string): i32 {
  return parseInt(hexString, 16) as i32;
}

export function hexToUtf8(hexString: string): string {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16) as u8;
  }
  let utf8String = "";
  for (let i = 0; i < bytes.length; ++i) {
    let byte = bytes[i];
    if (byte < 0x80) {
      utf8String += String.fromCharCode(byte);
    } else if (byte < 0xE0) {
      utf8String += String.fromCharCode(((byte & 0x1F) << 6) | (bytes[++i] & 0x3F));
    } else if (byte < 0xF0) {
      utf8String += String.fromCharCode(((byte & 0x0F) << 12) | ((bytes[++i] & 0x3F) << 6) | (bytes[++i] & 0x3F));
    } else {
      utf8String += String.fromCharCode(((byte & 0x07) << 18) | ((bytes[++i] & 0x3F) << 12) | ((bytes[++i] & 0x3F) << 6) | (bytes[++i] & 0x3F));
    }
  }
  return utf8String;
}

export function hexToBool(hexString: string): bool {
  let isZero = true;
  for (let i = 0; i < hexString.length; i++) {
    if (hexString.charAt(i) !== '0') {
      isZero = false;
      break;
    }
  }
  return !isZero;
}

export function hexToAddress(hexString: string): string {
  return hexString.slice(24);
}

export function ethToHex<T>(eth: T): string {
  const weiStr = ethToWei(eth);
  return weiToHex(weiStr);
}

export function ethToWei<T>(eth: T): string {
  if (eth instanceof String && eth === "") {
    throw new Error("Value is not a number");
  }
  const v = Big.of(eth).times(Big.of(10).pow(18));
  return v.__stringify(false, true);
}

export function weiToHex(value: string): string {
  return u128.from(value.toString()).toString(16);
}

export function buildTxSlot(valueHex: string): string {
  const value = valueHex.replace("0x", "");
  return "0".repeat(64 - value.length) + value;
}

export function buildTxString(args: string[]): string {
  return "0x" + args.join("");
}

export function utf8ArrayToString(array: Uint8Array): string {
  let result = "";
  let i = 0;
  while (i < array.length) {
    const byte = array[i++];
    if (byte < 0x80) {
      result += String.fromCharCode(byte);
    } else if (byte < 0xE0) {
      const byte2 = array[i++] & 0x3F;
      result += String.fromCharCode(((byte & 0x1F) << 6) | byte2);
    } else if (byte < 0xF0) {
      const byte2 = array[i++] & 0x3F;
      const byte3 = array[i++] & 0x3F;
      result += String.fromCharCode(((byte & 0x0F) << 12) | (byte2 << 6) | byte3);
    } else {
      const byte2 = array[i++] & 0x3F;
      const byte3 = array[i++] & 0x3F;
      const byte4 = array[i++] & 0x3F;
      const codepoint =
        ((byte & 0x07) << 18) | (byte2 << 12) | (byte3 << 6) | byte4;
      result += String.fromCharCode(
        0xD800 + (codepoint >> 10),
        0xDC00 + (codepoint & 0x3FF)
      );
    }
  }
  return result;
}