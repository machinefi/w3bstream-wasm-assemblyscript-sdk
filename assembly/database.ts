export class Bytes {
  static fromString(str: string): ArrayBuffer {
    return String.UTF8.encode(str);
  }

  static fromInt32(num: i32): ArrayBuffer {
    let bytes = new ArrayBuffer(4);
    let view = new DataView(bytes);
    view.setInt32(0, num, true);
    return bytes;
  }

  static fromInt64(num: i64): ArrayBuffer {
    let bytes = new ArrayBuffer(8);
    let view = new DataView(bytes);
    view.setInt64(0, num, true);
    return bytes;
  }

  static fromUint32(num: u32): ArrayBuffer {
    let bytes = new ArrayBuffer(4);
    let view = new DataView(bytes);
    view.setUint32(0, num, true);
    return bytes;
  }

  static fromUint64(num: u64): ArrayBuffer {
    let bytes = new ArrayBuffer(8);
    let view = new DataView(bytes);
    view.setUint64(0, num, true);
    return bytes;
  }

  static fromBool(bool: boolean): ArrayBuffer {
    let bytes = new ArrayBuffer(1);
    let view = new DataView(bytes);
    view.setUint8(0, bool ? 1 : 0);
    return bytes;
  }

  static fromFloat32(num: f32): ArrayBuffer {
    let bytes = new ArrayBuffer(4);
    let view = new DataView(bytes);
    view.setFloat32(0, num, true);
    return bytes;
  }

  static fromFloat64(num: f64): ArrayBuffer {
    let bytes = new ArrayBuffer(8);
    let view = new DataView(bytes);
    view.setFloat64(0, num, true);
    return bytes;
  }

  static toString(bytes: ArrayBuffer): string {
    return String.UTF8.decode(bytes);
  }

  static toInt32(bytes: ArrayBuffer): i32 {
    let view = new DataView(bytes);
    return view.getInt32(0, true);
  }

  static toInt64(bytes: ArrayBuffer): i64 {
    let view = new DataView(bytes);
    return view.getInt64(0, true);
  }

  static toUint32(bytes: ArrayBuffer): u32 {
    let view = new DataView(bytes);
    return view.getUint32(0, true);
  }

  static toUint64(bytes: ArrayBuffer): u64 {
    let view = new DataView(bytes);
    return view.getUint64(0, true);
  }

  static toBool(bytes: ArrayBuffer): boolean {
    let view = new DataView(bytes);
    return view.getUint8(0) == 1;
  }

  static toFloat32(bytes: ArrayBuffer): f32 {
    let view = new DataView(bytes);
    return view.getFloat32(0, true);
  }

  static toFloat64(bytes: ArrayBuffer): f64 {
    let view = new DataView(bytes);
    return view.getFloat64(0, true);
  }
}
