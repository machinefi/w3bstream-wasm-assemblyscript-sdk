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
  Int32: i32 = 0;
  Int64: i64 = 0;
  Float32: f32 = 0;
  Float64: f64 = 0;
  String: string = "";
  Time: string = "";
  Bool: bool = false;
  Bytes: string = "";
  abstract pushSQLType(encoder: JSONEncoder): i32;
}

class Int32 extends SQLTypes {
  Int32: i32;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setInteger("int32", this.Int32);
    return 0;
  }
  constructor(value: i32) {
    super();
    this.Int32 = value;
  }
}

class Int64 extends SQLTypes {
  Int64: i64;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setInteger("int64", this.Int64);
    return 0;
  }
  constructor(value: i64) {
    super();
    this.Int64 = value;
  }
}

class Float32 extends SQLTypes {
  Float32: f32;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setFloat("float32", this.Float32);
    return 0;
  }
  constructor(value: f32) {
    super();
    this.Float32 = value;
  }
}

class Float64 extends SQLTypes {
  Float64: f64;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setFloat("float64", this.Float64);
    return 0;
  }
  constructor(value: f64) {
    super();
    this.Float64 = value;
  }
}

class String extends SQLTypes {
  String: string;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setString("string", this.String);
    return 0;
  }
  constructor(value: string) {
    super();
    this.String = value;
  }
}

/**
 * Time is a rfc3339 encoding
 */
class Time extends SQLTypes {
  Time: string;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setString("time", this.Time);
    return 0;
  }
  constructor(value: string) {
    super();
    this.Time = value;
  }
}

class Bool extends SQLTypes {
  Bool: bool;
  pushSQLType(encoder: JSONEncoder): i32 {
    encoder.setBoolean("bool", this.Bool);
    return 0;
  }
  constructor(value: bool) {
    super();
    this.Bool = value;
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
    return 0;
  }
  constructor(value: Uint8Array) {
    super();
    this.Bytes = bytesToBase64(value);
  }
}


function bytesToBase64(bytes: Uint8Array): string {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    // Get three bytes from input
    const byte1 = bytes[i];
    const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

    // Combine three bytes into a 24-bit integer
    const threeBytes = (byte1 << 16) | (byte2 << 8) | byte3;

    // Split 24-bit integer into four 6-bit integers
    const char1 = (threeBytes >> 18) & 0x3f;
    const char2 = (threeBytes >> 12) & 0x3f;
    const char3 = (threeBytes >> 6) & 0x3f;
    const char4 = threeBytes & 0x3f;

    // Convert 6-bit integers to corresponding Base64 characters
    const base64Char1 = base64Chars.charAt(char1);
    const base64Char2 = base64Chars.charAt(char2);
    const base64Char3 = i + 1 < bytes.length ? base64Chars.charAt(char3) : "=";
    const base64Char4 = i + 2 < bytes.length ? base64Chars.charAt(char4) : "=";

    // Append Base64 characters to result
    result += base64Char1 + base64Char2 + base64Char3 + base64Char4;
  }

  return result;
}

export { Int32, Int64, Float32, Float64, String, Time, Bool, Bytes, SQLTypes };
