import { Readable } from "stream";

import {
  YYYYMMDDHHmmss,
  checkRequired,
  getApiResponseName,
  is,
  md5,
} from "./TopUtil";
import RestClient from "../api/network";
// import RestClient from "./network";

export default class TopClient {
  static appkey: string;
  static appsecret: string;
  static REST_URL?: string;
  static url?: string;

  constructor(options: {
    appkey: string;
    appsecret: string;
    REST_URL?: string;
    url?: string;
  }) {
    TopClient.url =
      options.REST_URL ?? options.url ?? "http://gw.api.taobao.com/router/rest";
    TopClient.appkey = options.appkey;
    TopClient.appsecret = options.appsecret;
  }

  static invoke(
    type: string,
    method: string,
    params: any,
    reponseNames: any,
    httpHeaders: any,
    callback: (error?: any, response?: any) => void
  ) {
    params.method = method;
    this.request(type, params, httpHeaders, function (err: any, result: any) {
      if (err) {
        return callback(err);
      }
      let response = result;
      if (reponseNames && reponseNames.length > 0) {
        for (let i = 0; i < reponseNames.length; i++) {
          let name = reponseNames[i];
          response = response[name];
          if (response === undefined) {
            break;
          }
        }
      }
      callback(null, response);
    });
  }

  static timestamp() {
    return YYYYMMDDHHmmss();
  }

  static request(
    type: string,
    params: any,
    httpHeaders: any,
    callback: (error?: any, response?: any) => void
  ) {
    let err = checkRequired(params, "method");
    if (err) {
      return callback(err);
    }
    let args = {
      timestamp: this.timestamp(),
      format: "json",
      app_key: this.appkey,
      v: "2.0",
      sign_method: "md5",
      sign: "",
    };

    // let request = null;
    if (type == "get") {
      // request = RestClient.get(this.url);
    } else {
      // request = RestClient.post(this.url);
    }
    let request: any = ""; // ! to remove after fixing whats above

    for (let key in params) {
      if (typeof params[key] === "object" && Buffer.isBuffer(params[key])) {
        request.attach(key, params[key], {
          knownLength: params[key].length,
          filename: key,
        });
      } else if (
        typeof params[key] === "object" &&
        new Readable(params[key]) &&
        !is(params[key]).a(String)
      ) {
        request.attach(key, params[key]);
      } else if (typeof params[key] === "object") {
        args[key as keyof typeof args] = JSON.stringify(params[key]);
      } else {
        args[key as keyof typeof args] = params[key];
      }
    }

    args.sign = this.sign(args);

    for (let key in httpHeaders) {
      request.header(key, httpHeaders[key]);
    }

    for (let key in args) {
      request.field(key, args[key as keyof typeof args]);
    }

    request.end((response: any) => {
      if (response.statusCode == 200) {
        let data = response.body;
        let errRes = data && data.error_response;
        if (errRes) {
          callback(errRes, data);
        } else {
          callback(err, data);
        }
      } else {
        err = new Error("NetWork-Error");
        err.name = "NetWork-Error";
        err.code = 15;
        err.sub_code = response.statusCode;
        callback(err, null);
      }
    });
  }

  static sign(params: {
    timestamp: string;
    format: string;
    app_key: string;
    v: string;
    sign_method: string;
  }) {
    let sorted = Object.keys(params).sort();
    let basestring = this.appsecret;
    for (let i = 0, l = sorted.length; i < l; i++) {
      let k = sorted[i];
      basestring += k + params[k as keyof typeof params];
    }
    basestring += this.appsecret;
    return md5(basestring).toUpperCase();
  }

  public execute(
    apiname: string,
    params: any,
    callback: (error?: any, response?: any) => void
  ) {
    TopClient.invoke(
      "post",
      apiname,
      params,
      [getApiResponseName(apiname)],
      [],
      callback
    );
  }

  public executeWithHeader(
    apiname: string,
    params: any,
    httpHeaders: any,
    callback: (error?: any, response?: any) => void
  ) {
    TopClient.invoke(
      "post",
      apiname,
      params,
      [getApiResponseName(apiname)],
      httpHeaders || [],
      callback
    );
  }

  public get(
    apiname: string,
    params: any,
    callback: (error?: any, response?: any) => void
  ) {
    TopClient.invoke(
      "get",
      apiname,
      params,
      [getApiResponseName(apiname)],
      [],
      callback
    );
  }
}
