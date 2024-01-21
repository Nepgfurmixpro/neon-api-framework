import {Route} from "../NeonController";

type NeonHeaders = Record<string, string>
type HTTPMethod = "GET" | "POST" | "DELETE" | "OPTIONS" | "PUT" | "CONNECT" | "PATCH"
type NeonRequestData = {
  headers: NeonHeaders,
  method: HTTPMethod,
  host: string,
  ip: string,
  path: string,
}
export type {
  NeonHeaders,
  HTTPMethod,
  NeonRequestData
}

// since i cant just use new URL without a stupid host
export const LOCAL_HOST = "http://localhost"

export default class NeonRequest {
  constructor({ headers, method, host, ip, path, body }: NeonRequestData) {
    this._headers = headers
    this._method = method
    this._host = host
    this._ip = ip
    this._path = new URL(path, LOCAL_HOST).pathname
    this._body = body
  }

  getPath(): string {
    return this._path
  }

  getMethod(): HTTPMethod {
    return this._method
  }

  getBody(): ArrayBuffer {

  }

  private _headers: NeonHeaders
  private _method: HTTPMethod
  private _host: string
  private _ip: string
  private _path: string
  private _body: string
}