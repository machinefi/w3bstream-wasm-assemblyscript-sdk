# w3bstream wasm assemblyscript sdk

This is the official assemblyscript sdk for w3bstream.

## Installation

```bash
npm install w3bstream-assemblyscript-sdk
```

### Log

> Log(message: string)

```typescript
import { Log } from "w3bstream-assemblyscript-sdk";

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
import { SendTx } from "w3bstream-assemblyscript-sdk";

export function start(rid: i32): i32 {
  const ERC20Addr = `0xb73eE6EB5b1984c78CCcC49eA7Ad773E71d74F51`;
  const account = `9117f5EF4156709092f79740a97b1638cA399A00`;
  SendTx(`
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
import { SetDB, Log, GetDB } from "w3bstream-assemblyscript-sdk";

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
export function start(rid: i32): i32 {
  Log("start from typescript");
  const key = GetDataByRID(rid);
  const v = new Map<string, i32>();
  v.set("int32", 1);
  const value = ExecSQL(`INSERT INTO "f_table" (f_id,f_gender) VALUES (?,?);`, [
    v,
    v,
  ]);
  return 0;
}
```

## More examples

[JSON Example](./examples/json/index.ts)

## Build

```bash
npm run asbuild:<example>
```
