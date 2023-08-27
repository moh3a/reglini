import axios from "axios";
import { createHash } from "crypto";

import type {
  AE_API_NAMES,
  AE_EXECUTE_FN_METHODS,
  AE_EXECUTE_FN_PARAMS,
  AE_EXECUTE_FN_RESULT,
  AE_SERVICE,
  PublicParams,
} from "@reglini-types/ae";

/**
 * @description Based on the service URL used to invoke APIs, the AliExpress open platform currently provides two environments for ISVs: Chinese environment, and overseas environment. The seller could initiate a performance test before deciding which url to choose.
 * @link Overseas environment (HTTP) = http://api.taobao.com/router/rest
 * @link Overseas environment (HTTPS) = 	https://api.taobao.com/router/rest
 */
export const AE_SERVICE_URL = "https://api.taobao.com/router/rest";

/**
 * Signature Algorithm
 * @description To prevent data from being tampered maliciously by a hacker during API invocation, each request for API invocation must carry a signature. The TOP server verifies the signature based on request parameters and rejects the request carrying an invalid signature. Currently, the TOP supports two signature algorithms: MD5(sign_method=md5) and HMAC_MD5(sign_method=hmac). The signature process is generally described as follows:
 * - Sort all request parameters of an API (including public parameters and service parameters, but excluding the sign parameter and parameters of the byte[] type) based on the sequence of their parameter names in the ASCII tabl. For example, parameters foo:1, bar:2, foo_bar:3, and foobar:4 are sorted as follows: bar:2, foo:1, foo_bar:3, foobar:4.
 * - Splice the sorted parameter names and values together to obtain a character string. For example, the character string obtained in the preceding example is bar2foo1foo_bar3foobar4.
 * - Encode the spliced character string based on UTF-8 encoding and use a signature algorithm to produce a digest for the encoded byte stream. If the MD5 algorithm is used, add the secret value of the corresponding application before and after the spliced character string, and then produce a digest, for example, md5(secret+bar2foo1foo_bar3foobar4+secret). If the HMAC_MD5 algorithm is used, initialize the digest algorithm based on the secret value of the corresponding application, and then produce a digest, for example, hmac_md5(bar2foo1foo_bar3foobar4).
 * - Denote the byte stream obtained after the digest in hexadecimal, for example, hex(“helloworld”.getBytes(“utf-8”)) = “68656C6C6F776F726C64”.
 */
export const sign_function = (app_secret: string, params: any) => {
  let sorted = Object.keys(params).sort();
  let basestring = app_secret;
  for (let i = 0; i < sorted.length; i++) {
    basestring += sorted[i] + params[sorted[i]];
  }
  basestring += app_secret;
  return createHash("md5")
    .update(basestring, "utf-8")
    .digest("hex")
    .toUpperCase();
};

export const call = async <T extends PublicParams, K>(params: T) => {
  let basestring = AE_SERVICE_URL;
  let sorted = Object.keys(params).sort();
  for (let i = 0; i < sorted.length; i++) {
    let symbol = i === 0 ? "?" : "&";
    if (params[sorted[i] as keyof typeof params])
      basestring +=
        symbol +
        sorted[i] +
        "=" +
        encodeURIComponent(
          params[sorted[i] as keyof typeof params] as number | string | boolean
        );
  }
  const { data } = await axios.post<K>(basestring, undefined);
  return data;
};

type Timestamp = string | number | Date;
export const get_timestamp = (d?: Timestamp) => {
  d = d || new Date();
  if (!(d instanceof Date)) {
    d = new Date(d);
  }
  let dateSep = "-";
  let timeSep = ":";
  let date: Timestamp = d.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  let month: Timestamp = d.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let hours: Timestamp = d.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let mintues: Timestamp = d.getMinutes();
  if (mintues < 10) {
    mintues = "0" + mintues;
  }
  let seconds: Timestamp = d.getSeconds();
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

export const execute = async <
  T extends AE_SERVICE,
  K extends AE_EXECUTE_FN_METHODS<T>
>(
  type: T,
  method: K,
  params: AE_EXECUTE_FN_PARAMS<K>
): Promise<AE_EXECUTE_FN_RESULT<K>> => {
  const app_secret =
    type === "affiliate"
      ? process.env.ALIEXPRESS_AFFILIATE_APP_SECRET ?? ""
      : process.env.ALIEXPRESS_DS_APP_SECRET ?? "";

  const parameters: AE_EXECUTE_FN_PARAMS<K> & PublicParams = {
    // @ts-ignore
    ...params,
    app_key:
      type === "affiliate"
        ? process.env.ALIEXPRESS_AFFILIATE_APP_KEY ?? ""
        : process.env.ALIEXPRESS_DS_APP_KEY ?? "",
    session:
      type === "affiliate"
        ? process.env.ALIEXPRESS_AFFILIATE_ACCESS_TOKEN ?? ""
        : process.env.ALIEXPRESS_DS_ACCESS_TOKEN ?? "",
    method,
    v: "2.0",
    format: "json",
    simplify: true,
    sign_method: "md5",
    timestamp: get_timestamp(),
  };
  parameters.sign = sign_function(app_secret, parameters);

  return await call<
    AE_EXECUTE_FN_PARAMS<K> & PublicParams,
    AE_EXECUTE_FN_RESULT<K>
  >(parameters);
};

export const old_execute = async <T, K extends object>(
  type: "affiliate" | "ds",
  method: AE_API_NAMES,
  params: T
) => {
  const app_secret =
    type === "affiliate"
      ? process.env.ALIEXPRESS_AFFILIATE_APP_SECRET ?? ""
      : process.env.ALIEXPRESS_DS_APP_SECRET ?? "";
  const parameters: T & PublicParams = {
    ...params,
    app_key:
      type === "affiliate"
        ? process.env.ALIEXPRESS_AFFILIATE_APP_KEY ?? ""
        : process.env.ALIEXPRESS_DS_APP_KEY ?? "",
    session:
      type === "affiliate"
        ? process.env.ALIEXPRESS_AFFILIATE_ACCESS_TOKEN ?? ""
        : process.env.ALIEXPRESS_DS_ACCESS_TOKEN ?? "",
    method,
    v: "2.0",
    format: "json",
    simplify: true,
    sign_method: "md5",
    timestamp: get_timestamp(),
  };
  parameters.sign = sign_function(app_secret, parameters);

  return await call<T & PublicParams, K>(parameters);
};
