import http from "http";
import stream from "stream";

type NeonHeaders = Record<string, string>
type HTTPMethod = "GET" | "POST" | "DELETE" | "OPTIONS" | "PUT" | "CONNECT" | "PATCH"
type NeonRequestData = {
  headers: NeonHeaders,
  method: HTTPMethod,
  host: string,
  ip: string,
  path: string,
  raw: http.IncomingMessage
}
export type {
  NeonHeaders,
  HTTPMethod,
  NeonRequestData
}

// since i cant just use new URL without a stupid host
export const LOCAL_HOST = "http://localhost"

export class NeonRequest {
  constructor({ headers, method, host, ip, path, raw }: NeonRequestData) {
    this._headers = headers
    this._method = method
    this._host = host
    this._ip = ip
    this._path = new URL(path, LOCAL_HOST).pathname
    this._raw = raw
  }

  getPath(): string {
    return this._path
  }

  getMethod(): HTTPMethod {
    return this._method
  }

  getStream(): stream.Readable {
    return this._raw
  }

  isOpen(): boolean {
    return !this._raw.closed
  }

  getHeader(name: string) {
    return this._raw.headers[name.toLowerCase()]
  }

  getQueryParams() {
    return new URL(this._raw.url ?? "", LOCAL_HOST).searchParams
  }

  private _headers: NeonHeaders
  private readonly _method: HTTPMethod
  private _host: string
  private _ip: string
  private readonly _path: string
  private readonly _raw: http.IncomingMessage
}