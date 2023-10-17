import { encode, decode } from "as-base64/assembly/index";
import { ApiCall, JSONEncoder, GetDataByRID, Log } from "./sdk";
import { JSON } from "./sdk"
import { utf8ArrayToString } from "./utility"

//refer:https://github.com/machinefi/w3bstream-wasm-golang-sdk/blob/main/api.md#send-zero-knowledge-proof
export class HTTP {
  static genZkProof(imageID: string, privateInput: string, publicInput: string, receiptType: string, eventType: string = "result"): string {
    Log(eventType)
    let bodyEncode = new JSONEncoder();
    bodyEncode.pushObject("");
    bodyEncode.setString('imageID', imageID);
    bodyEncode.setString('privateInput', privateInput);
    bodyEncode.setString('publicInput', publicInput);
    bodyEncode.setString('receiptType', receiptType);
    bodyEncode.popObject();

    let encoder = new JSONEncoder();
    encoder.pushObject("");
    encoder.setString('Method', 'POST');
    encoder.setString('Url', '/system/gen_zk_proof');
    encoder.pushObject("Header");
    encoder.pushArray("Eventtype");
    encoder.setString("", eventType);
    encoder.popArray();
    encoder.popObject();
    encoder.setString("Body", encode(bodyEncode.serialize()))
    encoder.popObject();
    let data = ApiCall(encoder.toString())
    return data;
  }

  static readTx(chainName: string, hash: string, eventType: string = "result"): string {
    let bodyEncode = new JSONEncoder();
    bodyEncode.pushObject("");
    bodyEncode.setString('chainName', chainName);
    bodyEncode.setString('hash', hash);
    bodyEncode.popObject();

    let encoder = new JSONEncoder();
    encoder.pushObject("");
    encoder.setString('Method', 'GET');
    encoder.setString('Url', '/system/read_tx');
    encoder.pushObject("Header");
    encoder.pushArray("Eventtype");
    encoder.setString("", eventType);
    encoder.popArray();
    encoder.popObject();
    encoder.setString("Body", encode(bodyEncode.serialize()))
    encoder.popObject();
    let data = ApiCall(encoder.toString())
    return data;
  }

  static sendTx(chainName: string, operatorName: string, to: string, value: string, data: string, eventType: string = "result"): string {
    let bodyEncode = new JSONEncoder();
    bodyEncode.pushObject("");
    bodyEncode.setString('chainName', chainName);
    bodyEncode.setString('operatorName', operatorName);
    bodyEncode.setString('to', to);
    bodyEncode.setString('value', value);
    bodyEncode.setString('data', data);

    bodyEncode.popObject();

    let encoder = new JSONEncoder();
    encoder.pushObject("");
    encoder.setString('Method', 'POST');
    encoder.setString('Url', '/system/send_tx');
    encoder.pushObject("Header");
    encoder.pushArray("Eventtype");
    encoder.setString("", eventType);
    encoder.popArray();
    encoder.popObject();
    encoder.setString("Body", encode(bodyEncode.serialize()))
    encoder.popObject();

    let res = ApiCall(encoder.toString())
    return res;
  }

  static parseResult(message: string): string {
    let messageJSON: JSON.Obj = JSON.parse(
      message
    ) as JSON.Obj;
    let body_base64: JSON.Str | null = messageJSON.getString("Body") as JSON.Str;
    if (body_base64) {
      let body = decode(body_base64.toString());
      let bodyString = utf8ArrayToString(body);
      return bodyString;
    } else {
      return "";
    }
  }
}



