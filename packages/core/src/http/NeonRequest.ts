type NeonHeaders = Record<string, string>
type HTTPMethod = "GET" | "POST" | "DELETE" | "OPTIONS" | "PUT" | "CONNECT" | "PATCH"
type NeonRequestData = {
  headers: NeonHeaders,
  method: HTTPMethod,
  host: string,
  ip: string,
  url: string
}
export type {
  NeonHeaders,
  HTTPMethod,
  NeonRequestData
}


export default class NeonRequest {
  constructor(data: NeonRequestData) {
  }
}