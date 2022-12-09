import { StringDecoder } from "string_decoder";
import Stream from "stream";
import mime from "mime";
import path from "path";
import URL from "url";
import fs from "fs";
const FormData = require("form-data");

import QueryString from "node:querystring";
import zlib from "node:zlib";

mime.define({
  "application/x-www-form-urlencoded": ["form", "urlencoded", "form-data"],
});

interface $this {
  _stream: boolean;
  _multipart: { name: any; value: any; options: any; attachment: any }[];
  _form: any[];
  options: {
    url: string;
    method?: string;
    headers: any;
    body: any;
    json: any;
  };
  hasHeader: (name: string) => any;
  field: (name: any, value: any, options: any) => any;
  attach: (name: any, path: any, options: any) => any;
  rawField: (name: any, value: any, options: any) => any;
  header: (field: any, value: any) => any;
  type: (type: string) => any;
  send: (data: any) => any;
  end: (callback: any) => any;
  headers?: any;
  set?: any;
  complete?: any;
  as?: any;
}

let RestClient = (
  method?: string,
  uri?: string,
  headers?: any,
  body?: any,
  callback?: (err: any, res: any) => void
) => {
  let restClient = (uri: any, headers: any, body: any, callback: any) => {
    let $this: $this = {
      _stream: false, // Stream Multipart form-data request
      _multipart: [], // Container to hold multipart form data for processing upon request.
      _form: [], // Container to hold form data for processing upon request.
      // Request option container for details about the request.
      options: {
        url: uri, // Url obtained from request method arguments.
        method: method, // Method obtained from request method arguments.
        headers: {}, //List of headers with case-sensitive fields.
        body: {},
        json: {},
      },

      hasHeader: (name: string) => {
        let headers;
        let lowercaseHeaders;

        name = name.toLowerCase();
        headers = Object.keys($this.options.headers);
        lowercaseHeaders = headers.map(function (header) {
          return header.toLowerCase();
        });

        for (let i = 0; i < lowercaseHeaders.length; i++) {
          if (lowercaseHeaders[i] === name) {
            return headers[i];
          }
        }

        return false;
      },

      field: (name, value, options) => {
        return handleField(name, value, options);
      },

      attach: (name, path, options) => {
        options = options || {};
        options.attachment = true;
        return handleField(name, path, options);
      },

      rawField: (name, value, options) => {
        $this._multipart.push({
          name: name,
          value: value,
          options: options,
          attachment: options.attachment || false,
        });
      },

      header: (field, value) => {
        if (is(field).a(Object)) {
          for (var key in field) {
            if (field.hasOwnProperty(key)) {
              $this.header(key, field[key]);
            }
          }

          return $this;
        }

        let existingHeaderName = $this.hasHeader(field);
        $this.options.headers[existingHeaderName || field] = value;

        return $this;
      },

      type: (type) => {
        $this.header(
          "Content-Type",
          does(type).contain("/") ? type : mime.getType(type)
        );
        return $this;
      },

      send: (data) => {
        var type = $this.options.headers[$this.hasHeader("content-type")];

        if (
          (is(data).a(Object) || is(data).a(Array)) &&
          !Buffer.isBuffer(data)
        ) {
          if (!type) {
            $this.type("form");
            type = $this.options.headers[$this.hasHeader("content-type")];
            $this.options.body = serializers.form(data);
          } else if (~type.indexOf("json")) {
            $this.options.json = true;

            if ($this.options.body && is($this.options.body).a(Object)) {
              for (var key in data) {
                if (data.hasOwnProperty(key)) {
                  $this.options.body[key] = data[key];
                }
              }
            } else {
              $this.options.body = data;
            }
          } else {
            $this.options.body = Request.serialize(data, type);
          }
        } else if (is(data).a(String)) {
          if (!type) {
            $this.type("form");
            type = $this.options.headers[$this.hasHeader("content-type")];
          }

          if (type === "application/x-www-form-urlencoded") {
            $this.options.body = $this.options.body
              ? $this.options.body + "&" + data
              : data;
          } else {
            $this.options.body = ($this.options.body || "") + data;
          }
        } else {
          $this.options.body = data;
        }

        return $this;
      },

      end: (callback) => {
        let Request;
        let header;
        let parts;
        let form;

        const handleRequestResponse = (
          error: any,
          response: any,
          body?: any
        ) => {
          let result: any = {};
          // Handle pure error
          if (error && !response) {
            result.error = error;

            if (callback) {
              callback(result);
            }

            return;
          }

          if (!response) {
            result.error = {
              message: "No response found.",
            };
            if (callback) {
              callback(result);
            }
            return;
          }

          result = response;

          body = body || response.body;
          result.raw_body = body;
          result.headers = response.headers;
          let data;

          if (body) {
            let stype = type(result.headers["content-type"], true);
            if (stype) data = Response.parse(body, stype);
            else data = body;
          }
          result.body = data;
          callback && callback(result);
        };

        const handleGZIPResponse = (response: any) => {
          if (/^(deflate|gzip)$/.test(response.headers["content-encoding"])) {
            let unzip = zlib.createUnzip();
            let stream = new Stream();
            let _on = response.on;
            let decoder: any;

            // Keeping node happy
            (stream as any).req = response.req;

            // Make sure we emit prior to processing
            unzip.on("error", (error: any) => {
              // Catch the parser error when there is no content
              if (
                error.errno === zlib.Z_BUF_ERROR ||
                error.errno === zlib.Z_DATA_ERROR
              ) {
                stream.emit("end");
                return;
              }

              stream.emit("error", error);
            });

            // Start the processing
            response.pipe(unzip);

            // Ensure encoding is captured
            response.setEncoding = (type: any) => {
              decoder = new StringDecoder(type);
            };

            // Capture decompression and decode with captured encoding
            unzip.on("data", (buffer: any) => {
              if (!decoder) return stream.emit("data", buffer);
              let string = decoder.write(buffer);
              if (string.length) stream.emit("data", string);
            });

            // Emit yoself
            unzip.on("end", function () {
              stream.emit("end");
            });

            response.on = (type: any, next: any) => {
              if (type === "data" || type === "end") {
                stream.on(type, next);
              } else if (type === "error") {
                _on.call(response, type, next);
              } else {
                _on.call(response, type, next);
              }
            };
          }
        };

        const handleFormData = (form: any) => {
          for (let i = 0; i < $this._multipart.length; i++) {
            let item: any = $this._multipart[i];

            if (item.attachment && is(item.value).a(String)) {
              if (
                does(item.value).contain("http://") ||
                does(item.value).contain("https://")
              ) {
                item.value = request(item.value);
              } else {
                item.value = fs.createReadStream(path.resolve(item.value));
              }
            }
            form.append(item.name, item.value, item.options);
          }

          return form;
        };

        if (
          $this._multipart.length &&
          !$this._stream &&
          $this.options.method != "get"
        ) {
          header = $this.options.headers[$this.hasHeader("content-type")];
          parts = URL.parse($this.options.url);
          form = new FormData();

          if (header) {
            $this.options.headers["content-type"] =
              header.split(";")[0] + "; boundary=" + form.getBoundary();
          } else {
            $this.options.headers["content-type"] =
              "multipart/form-data; boundary=" + form.getBoundary();
          }

          return handleFormData(form).submit(
            {
              protocol: parts.protocol,
              port: parts.port,
              host: parts.hostname,
              path: parts.path,
              method: $this.options.method,
              headers: $this.options.headers,
            },
            (error: any, response: any) => {
              let decoder = new StringDecoder("utf8");

              if (error) {
                return handleRequestResponse(error, response);
              }

              if (!response.body) {
                response.body = "";
              }

              // Node 10+
              response.resume();

              // GZIP, Feel me?
              handleGZIPResponse(response);

              // Fallback
              response.on("data", (chunk: any) => {
                if (typeof chunk === "string") response.body += chunk;
                else response.body += decoder.write(chunk);
              });

              // After all, we end up here
              response.on("end", function () {
                return handleRequestResponse(error, response);
              });
            }
          );
        }

        Request = request($this.options, handleRequestResponse);
        Request.on("response", handleGZIPResponse);

        if ($this._multipart.length && $this._stream) {
          handleFormData(Request.form());
        }

        return Request;
      },
    };

    $this.headers = $this.header; // Alias for _.header_
    $this.set = $this.header; // Alias for _.header_
    $this.complete = $this.end; // Alias for _.end_
    $this.as = {
      // Aliases for _.end_
      json: $this.end,
      binary: $this.end,
      string: $this.end,
    };

    // Handles Multipart Field Processing
    const handleField = (name: any, value: any, options: any) => {
      let serialized;
      let length;
      let key;
      let i;

      options = options || { attachment: false };

      if (is(name).a(Object)) {
        for (key in name) {
          if (name.hasOwnProperty(key)) {
            handleField(key, name[key], options);
          }
        }
      } else {
        if (is(value).a(Array)) {
          for (i = 0, length = value.length; i < length; i++) {
            serialized = handleFieldValue(value[i]);
            if (serialized) {
              $this.rawField(name, serialized, options);
            }
          }
        } else if (value != null) {
          $this.rawField(name, handleFieldValue(value), options);
        }
      }

      return $this;
    };

    // Handles Multipart Value Processing
    const handleFieldValue = (value: any) => {
      if (!(value instanceof Buffer || typeof value === "string")) {
        if (is(value).a(Object)) {
          if (value instanceof Stream.Readable) {
            return value;
          } else {
            return serializers.json(value);
          }
        } else {
          return value.toString();
        }
      } else return value;
    };

    if (headers && typeof headers === "function") {
      callback = headers;
      headers = null;
    } else if (body && typeof body === "function") {
      callback = body;
      body = null;
    }

    if (headers) $this.set(headers);
    if (body) $this.send(body);

    return callback ? $this.end(callback) : $this;
  };

  return uri ? restClient(uri, headers, body, callback) : restClient;
};

/**
 * Expose the underlying layer.
 */
const request = require("request");
const pipe = request.pipe;

let type = (type: any, parse: any) => {
  if (typeof type !== "string") return false;
  return parse ? type.split(/ *; */).shift() : type;
};

const trim = (s: string) => {
  return s.trim();
};

const parsers = {
  string: (data: any) => {
    let obj: any = {};
    let pairs = data.split("&");
    let parts;
    let pair;
    for (let i = 0, len = pairs.length; i < len; ++i) {
      pair = pairs[i];
      parts = pair.split("=");
      obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return obj;
  },
  json: (data: any) => {
    try {
      data = JSON.parse(data);
    } catch (e) {}
    return data;
  },
};

// Serialization methods for different data types.
const serializers = {
  form: function (obj: any) {
    return QueryString.stringify(obj);
  },
  json: function (obj: any) {
    return JSON.stringify(obj);
  },
};

// RestClient Request Utility Methods
const Request = {
  serialize: (string: any, type: any) => {
    var serializer = firstMatch(type, ENUM.serialize);
    return serializer ? serializer(string) : string;
  },
};

const Response = {
  parse: (string: any, type: any) => {
    var parser = firstMatch(type, ENUM.parse);
    return parser ? parser(string) : string;
  },
};

const ENUM = {
  serialize: {
    "application/x-www-form-urlencoded": serializers.form,
    "application/json": serializers.json,
    "text/javascript": serializers.json,
  },

  parse: {
    "application/x-www-form-urlencoded": parsers.string,
    "application/json": parsers.json,
    "text/javascript": parsers.json,
  },

  methods: ["GET", "HEAD", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
};

const matches = function matches(string: any, map: any) {
  let results = [];

  for (let key in map) {
    if (typeof map.length !== "undefined") {
      key = map[key];
    }

    if (string.indexOf(key) !== -1) {
      results.push(map[key]);
    }
  }

  return results;
};

const firstMatch = function firstMatch(string: any, map: any) {
  return matches(string, map)[0];
};

/**
 * Generate sugar for request library.

 * This allows us to mock super-agent chaining style while using request library under the hood.
 */
const setupMethod = (method: string) => {
  [method] = RestClient(method);
};

for (let i = 0; i < ENUM.methods.length; i++) {
  let method = ENUM.methods[i].toLowerCase();
  setupMethod(method);
}

const is = (value: any) => {
  return {
    a: (check: any) => {
      if (check.prototype) check = check.prototype.constructor.name;
      let type = Object.prototype.toString
        .call(value)
        .slice(8, -1)
        .toLowerCase();
      return value != null && type === check.toLowerCase();
    },
  };
};

//Simple Utility Methods for checking information about a value.
const does = (value: any) => {
  // @ts-ignore
  let arrayIndexOf = Array.indexOf
    ? (arr: Array<any>, obj: any, from?: number) => {
        return arr.indexOf(obj, from);
      }
    : (arr: Array<any>, obj: any, from?: number) => {
        let l = arr.length;
        // @ts-ignore
        let i = from ? parseInt(1 * from + (from < 0 ? l : 0), 10) : 0;
        i = i < 0 ? 0 : i;
        for (; i < l; i++) if (i in arr && arr[i] === obj) return i;
        return -1;
      };

  return {
    contain: (field: any) => {
      if (is(value).a(String)) return value.indexOf(field) > -1;
      if (is(value).a(Object)) return value.hasOwnProperty(field);
      if (is(value).a(Array)) return !!~arrayIndexOf(value, field);
      return false;
    },
  };
};

export default RestClient;
