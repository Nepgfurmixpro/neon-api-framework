import * as http from "http";

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
    if (this._res.hasHeader(name)) {
      let previousHeaders = this._res.getHeader(name)
      if (typeof previousHeaders == "string") {
        previousHeaders = [previousHeaders]
      }
      this._res.setHeader(name, [...previousHeaders as string[], value])
    } else {
      this._res.setHeader(name, value)
    }
  }

  end() {
    this._ended = true
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

  isOpen() {
    return !this._res.closed
  }

  isEnded() {
    return this._ended
  }

  private readonly _res: http.ServerResponse
  private _ended = false
}