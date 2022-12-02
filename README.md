# w3bstream wasm assemblyscript sdk

This is the official assemblyscript sdk for w3bstream.

## Installation

```bash
npm install w3bstream-assemblyscript-sdk
```

## Usage

> Frist you need to export alloc and abort from your `applet.ts` to the global scope

### Export alloc for w3bstream vm and export abort for assemblyScript special use

`applet.ts`
```typescript
/**Export start function for w3bstream */
export function start(rid: i32): i32 {
    /*Your main code here.*/
}

/**Export alloc for w3bstream vm */
export function alloc(size: usize): usize {
  return heap.alloc(size);
}

/** Export abort for assemblyScript special use
 * @doc: https://www.assemblyscript.org/concepts.html#special-imports
 */
function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void {}
```
### Log 

> Log(message: string)

```typescript

import { sdk } from "w3bstream-assemblyscript-sdk";

export function start(rid: i32): i32 {
  sdk.Log("Start from assemblyscript");
  const message = GetDataByRID(rid);
  sdk.Log("wasm received message:" + message);
  return 0;
}
```

### SendTx
> SendTx(tx: string)
```typescript
import { sdk } from "w3bstream-assemblyscript-sdk";

export function start(rid: i32): i32 {
  const ERC20Addr = `0xb73eE6EB5b1984c78CCcC49eA7Ad773E71d74F51`;
  const account = `9117f5EF4156709092f79740a97b1638cA399A00`;
  sdk.SendTx(`
  {
      "to": "${ERC20Addr}",
      "value": "0",
      "data": "40c10f19000000000000000000000000${account}0000000000000000000000000000000000000000000000000de0b6b3a7640000"
  }`);
  return 0;
}
```

### GetDB & SetDB
> SetDB(key: string, value: i32)

> GetDB(key: string)
```typescript
import { sdk } from "w3bstream-assemblyscript-sdk";

export function start(rid: i32): i32 {
  sdk.SetDB("wordCount", word.length);
  let value = sdk.GetDB("wordCount");
  sdk.Log("wasm get value:" + value.toString());
  return 0;
}
```

## More examples
https://github.com/machinefi/w3bstream_compilets_demo