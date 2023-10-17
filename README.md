# @w3bstream/wasm-sdk

This is the official assemblyscript sdk for W3bstream.

## Installation
The package requires node.js `>=16.0.0`

```bash
npm install @w3bstream/wasm-sdk
```


## Useage

**Your must export alloc function from @w3bstream/wasm-sdk for w3bstream vm**

### Log

> Log(message: string)

```typescript
import { Log } from "@w3bstream/wasm-sdk";
//export alloc for w3bstream vm
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  Log("Start from assemblyscript");
  const message = GetDataByRID(rid);
  Log("wasm received message:" + message);
  return 0;
}
```

### SendTx

> SendTx(chainId:i32, tx: string) : string

```typescript
import { SendTx } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const ERC20Addr = `0xb73eE6EB5b1984c78CCcC49eA7Ad773E71d74F51`;
  const account = `9117f5EF4156709092f79740a97b1638cA399A00`;
  const hash = SendTx(
    4690,
    `
  {
      "to": "${ERC20Addr}",
      "value": "0",
      "data": "40c10f19000000000000000000000000${account}0000000000000000000000000000000000000000000000000de0b6b3a7640000"
  }`
  );
  Log("wasm send tx:" + hash);
  return 0;
}
```

### GetDB & SetDB

> SetDB(key: string, value: i32)

> GetDB(key: string)

```typescript
import { SetDB, Log, GetDB } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  SetDB("wordCount", word.length);
  let value = GetDB("wordCount");
  Log("wasm get value:" + value.toString());
  return 0;
}
```

### ExecSQL & QuerySQL

#### First, you need to create a project with database schema for wasm db storage

[Create Database Schema](https://github.com/machinefi/w3bstream/blob/main/HOWTO.md#create-project-with-database-schema-for-wasm-db-storage)

```typescript
curl --location --request GET 'http://localhost:8888/srv-applet-mgr/v0/project_config/project_01/PROJECT_SCHEMA' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQYXlsb2FkIjoiOTAxNjYzODYzNTI5Njc3NSIsImlzcyI6InczYnN0cmVhbSIsImV4cCI6MTY3NTE0MzA0Nn0.okRRanlER4OwZTSS60m4qdg5F4qjVWDcPys-eAJ5KkE' \
--header 'Content-Type: application/json' \
--data-raw '{
  "tables": [
    {
      "name": "f_table",
      "desc": "test table",
      "cols": [
        {
          "name": "f_gender",
          "constrains": {
            "datatype": "UINT8",
            "length": 255,
            "default": "0",
            "desc": "user name"
          }
        }
      ],
      "keys": [
        {
          "name": "ui_gender",
          "isUnique": true,
          "columnNames": [
            "f_gender"
          ]
        }
      ],
      "withSoftDeletion": true,
      "withPrimaryKey": true
    }
  ]
}'
```

```typescript
export { alloc } from "@w3bstream/wasm-sdk";
import { ExecSQL, QuerySQL, Log } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  Log("start from typescript");
  const key = GetDataByRID(rid);
  const v = new Map<string, i32>();
  v.set("int32", 1);
  const value = ExecSQL(`INSERT INTO "f_table" (f_id,f_gender) VALUES (?,?);`, [v, v]);
  const res = QuerySQL(`SELECT * FROM "f_table" WHERE f_id = ?;`, [v]);
  Log("wasm get value:" + value);
  Log("wasm get res:" + res);  
  return 0;
}
```

## GetEnv(key:string)

```typescript
import { GetEnv, Log } from "@w3bstream/wasm-sdk";
export { alloc } from "@w3bstream/wasm-sdk";

export function start(rid: i32): i32 {
  const key = GetDataByRID(rid);
  const value = GetEnv(key);
  Log("wasm get env:" + value);
  return 0;
}
```

## CallContract(chainId:i32,to:string,data:string) : string

```typescript
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
```

## Api call document
> https://github.com/machinefi/w3bstream-wasm-golang-sdk/blob/main/api.md#send-zero-knowledge-proof

## Build

> https://www.assemblyscript.org/concepts.html#special-imports

The abort method will be exposed inside w3bstream in later versions
[issues/308](https://github.com/machinefi/w3bstream/issues/308)

```typescript
export function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void {}
```

package.json

```json
"scripts": {
    "asbuild:release": "asc assembly/index.ts --use abort=assembly/index/abort --target release",
  },
```

Some language features need support from the host environment to function, yielding a few special module imports depending on the feature set used within the module. Generated bindings provide these automatically where necessary.

- function env.abort?(message: usize, fileName: usize, line: u32, column: u32): void

The respective implementations of , and can be overridden with, for example, , here redirecting calls to to a custom function in . Useful if an environment does not provide compatible implementations, or when the respective imports are not desired and custom implementations are sufficient.aborttraceseed--use abort=assembly/index/myAbortabortmyAbortassembly/index.ts

## Known Issues

- If the `pnpm` installation package is used, dependencies may not be correctly installed. You can use `npm` or `yarn` to install dependencies

## Run examples

Examples can be found in the ./examples folder.

To build an example, from the main SDK folder type:

```
npm install
npm run build:<example_name>
```

Available examples are:

- `abort` - Tests the call of the `abort` function on the W3bstream VM side by calling `assert` in your applet.
- `click2earn` - a simple applet that mints ERC20 tokens every 5 "click" messages are received
- `env` - shows how to retrieve env variable for the parent project (a defined in the project's settings on dev.w3bstream.com)
- `erc20_mint` - a basic example that shows how to mint ERC20 tokens from an applet according to the info included in the data message
- `json` - shows how to parse a data message and extract specific fields
- `sql` - shows how to insert and query data from W3bstreams database using SQL
- `token_distribute` - another basic example that sends ERC20 tokens to a wallet
- `vm` - another example of using `assert` in your applet
- `word_count` - counts the number of words included in a message payload and shows how to save it in W3bstream's key/value storage.
