import { createHash } from "crypto";
import { networkInterfaces } from "os";

export const sortObject = (obj: any) => {
  Object.keys(obj)
    .sort()
    .reduce((accumulator: any, key) => {
      accumulator[key] = obj[key];

      return accumulator;
    }, {});
};

export const hash = (
  method: "md5" | "sha1",
  s: string | Buffer,
  format: "hex" | "base64" = "hex"
) => {
  const sum = createHash(method);
  const isBuffer = Buffer.isBuffer(s);
  if (!isBuffer && typeof s === "object") {
    s = JSON.stringify(sortObject(s));
  }
  sum.update(s.toString(), isBuffer ? "binary" : "utf8");
  return sum.digest(format || "hex");
};

export const md5 = (s: string | Buffer, format: "hex" | "base64" = "hex") => {
  return hash("md5", s, format);
};

export const YYYYMMDDHHmmss = (d?: any, options?: any) => {
  d = d || new Date();
  if (!(d instanceof Date)) {
    d = new Date(d);
  }

  let dateSep = "-";
  let timeSep = ":";
  if (options) {
    if (options.dateSep) {
      dateSep = options.dateSep;
    }
    if (options.timeSep) {
      timeSep = options.timeSep;
    }
  }
  let date = d.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  let month = d.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let hours = d.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let mintues = d.getMinutes();
  if (mintues < 10) {
    mintues = "0" + mintues;
  }
  let seconds = d.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return (
    d.getFullYear() +
    dateSep +
    month +
    dateSep +
    date +
    " " +
    hours +
    timeSep +
    mintues +
    timeSep +
    seconds
  );
};

export const checkRequired = (
  params: { hasOwnProperty: (arg0: any) => any },
  keys: string | any[]
) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  for (let i = 0, l = keys.length; i < l; i++) {
    let k = keys[i];
    if (!params.hasOwnProperty(k)) {
      let err: Error & { code?: number; sub_code?: string } = new Error(
        "`" + k + "` required"
      );
      err.name = "ParameterMissingError";
      return err;
    }
  }
};

export const getApiResponseName = (apiName: string) => {
  let reg = /\./g;
  if (apiName.match("^taobao")) apiName = apiName.substring(7);
  return apiName.replace(reg, "_") + "_response";
};

export const getLocalIPAdress = () => {
  let interfaces = networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    if (iface) {
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
};

export const is = (value: any) => {
  return {
    a: function (check: any) {
      if (check.prototype) check = check.prototype.constructor.name;
      let type = Object.prototype.toString
        .call(value)
        .slice(8, -1)
        .toLowerCase();
      return value != null && type === check.toLowerCase();
    },
  };
};
