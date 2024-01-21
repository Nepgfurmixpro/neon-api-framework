import * as http from "http";

type ResponseFormatterFunction = (res: NeonResponse) => any

export type {
  ResponseFormatterFunction
}

export function json(data: any): ResponseFormatterFunction {
  return (res) => {
    res.setContentType("application/json")
    return JSON.stringify(data)
  }
}

export function url(data: Record<string, any>): ResponseFormatterFunction {
  return (res) => {
    res.setContentType("application/x-www-form-urlencoded")
    return new URLSearchParams(data)
      .toString()
  }
}

export function html(data: string): ResponseFormatterFunction {
  return (res) => {
    res.setContentType("text/html")
    return data
  }
}

export class NeonResponse {
  constructor(res: http.ServerResponse) {
    this._res = res;
  }

  setContentType(contentType: string) {
    this._res.setHeader("Content-Type", contentType)
  }

  setStatus(status: number) {
    this._res.statusCode = status
  }

  setHeader(name: string, value: string) {
    this._res.setHeader(name, value)
  }

  end() {
    this._res.end()
  }

  send(data: any): Promise<void> {
    return new Promise((res, rej) => {
      this.setHeader("Connection", "close")
      this._res.write(data, (err) => {
        if (err) rej(err.message)
        else res();
        this.end()
      })
    })
  }
  getStatus() {
    return this._res.statusCode
  }

  private readonly _res: http.ServerResponse
}