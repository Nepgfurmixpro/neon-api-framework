import {BodyParserFunction, ContentTypeBuilder} from "../NeonAPI";
import stream from "stream"

export function BodyType(type: string) {
  return (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => {
    Reflect.set(descriptor.value, "bodyType", type)
  }
}

export function Json() {
  return BodyType("application/json")
}

export function UrlEncoded() {
  return BodyType("application/x-www-form-urlencoded")
}

export function getStreamData(stream: stream.Readable): Promise<string> {
    return new Promise((res, rej) => {
      let chunks: Buffer[] = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk)
      }).on("end", () => {
        res(Buffer.concat(chunks).toString())
      }).on("error", (err) => {
        rej(err)
      })
    })
}

export function bodyParserFunc(cb: (str: string) => any): BodyParserFunction {
  return (stream) => new Promise((res, rej) => {
    getStreamData(stream).then((str) => {
      res(cb(str))
    }).catch(rej)
  })
}

export function basicContentType(type: string, cb: (str: string) => any) {
  return () => {
    return {
      bodyType: type,
      func: bodyParserFunc(cb)
    }
  }
}

export const ContentTypes: Record<"Json" | "UrlEncoded", ContentTypeBuilder> = {
  Json: basicContentType("application/json", (str) => {
    try {
      return JSON.parse(str ?? "")
    } catch (e) {
      return {}
    }
  }),
  UrlEncoded: basicContentType("application/x-www-form-urlencoded", (str) => {
    const params = new URLSearchParams(str)
    const out: {[key: string]: string} = {}
    for (const [key, value] of params.entries()) {
      out[key] = value
    }
    return out
  })
}