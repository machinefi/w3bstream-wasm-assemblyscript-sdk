
class dBQuery {
  Statement: string = "";
  Params: param[] = [];
}

class param {
  Int32: i32 | null = null;
}

abstract class SQLTypes {
  abstract getParam(): param
}


class Int32 extends SQLTypes {
  v: i32 | null = null;
  constructor(v: i32) {
    super();
    this.v = v
  }

  getParam(): param {
    return {
      Int32: this.v
    }
  }
}


export { SQLTypes, dBQuery, Int32 }