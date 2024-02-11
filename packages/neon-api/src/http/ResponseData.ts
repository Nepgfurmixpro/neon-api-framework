import {NeonResponse} from "./NeonResponse";
import {NeonHeaders} from "./NeonRequest";
import {getFunctionFromResponse} from "../utils";

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

export function headers(headers: NeonHeaders, data: ResponseFormatterFunction | object): ResponseFormatterFunction {
  const func = getFunctionFromResponse(data)
  return (res) => {
    for (const [name, value] of Object.entries(headers)) {
      res.setHeader(name, value)
    }
    return func(res)
  }
}

export function status(code: number, data: ResponseFormatterFunction | object): ResponseFormatterFunction {
  const func = getFunctionFromResponse(data)
  return (res) => {
    res.setStatus(code)

    return func(res)
  }
}