// param struct {
//   Int32   int32   `json:"int32,omitempty"`
//   Int64   int64   `json:"int64,omitempty"`
//   Float32 float32 `json:"float32,omitempty"`
//   Float64 float64 `json:"float64,omitempty"`
//   String  string  `json:"string,omitempty"`
//   Time    string  `json:"time,omitempty"` //  rfc3339 encoding
//   Bool    bool    `json:"bool,omitempty"`
//   Bytes   string  `json:"bytes,omitempty"` // base64 encoding
// }

import { JSONEncoder } from "./sdk";

abstract class SQLTypes {
  Int32: i32 | null = null;
  Int64: i64 | null = null;
  Float32: f32 | null = null;
  Float64: f64 | null = null;
  String: string | null = null;
  Time: string | null = null;
  Bool: bool | null = null;
  Bytes: string | null = null;
  abstract pushSQLType(encoder: JSONEncoder): i32
}


class Int32 extends SQLTypes {
  Int32: i32;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setInteger("int32", this.Int32);
    return 0
  }
  constructor(value: i32) {
    super();
    this.Int32 = value
  }
}

class Int64 extends SQLTypes {
  Int64: i64;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setInteger("int64", this.Int64);
    return 0
  }
  constructor(value: i32) {
    super();
    this.Int64 = value
  }
}

class Float32 extends SQLTypes {
  Float32: f32;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setFloat("float32", this.Float32);
    return 0
  }
  constructor(value: i32) {
    super();
    this.Float32 = value
  }
}

class Float64 extends SQLTypes {
  Float64: f64;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setFloat("float64", this.Float64);
    return 0
  }
  constructor(value: i32) {
    super();
    this.Float64 = value
  }
}

class String extends SQLTypes {
  String: string;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setString("string", this.String);
    return 0
  }
  constructor(value: string) {
    super();
    this.String = value
  }
}

/**
 * Time is a rfc3339 encoding
 */
class Time extends SQLTypes {
  Time: string;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setString("time", this.Time);
    return 0
  }
  constructor(value: string) {
    super();
    this.Time = value
  }
}

class Bool extends SQLTypes {
  Bool: bool;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setBoolean("bool", this.Bool);
    return 0
  }
  constructor(value: bool) {
    super();
    this.Bool = value
  }
}

/**
 * Bytes is a base64 encoded string
 */
class Bytes extends SQLTypes {
  Bytes: string;
  pushSQLType(encoder: JSONEncoder): i32 {
    //base64 encoding
    encoder.setString("bytes", this.Bytes);
    return 0
  }
  constructor(value: string) {
    super();
    this.Bytes = value
  }
}

export { Int32, Int64, Float32, Float64, String, Time, Bool, Bytes }