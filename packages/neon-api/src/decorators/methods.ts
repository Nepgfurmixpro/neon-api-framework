import {HTTPMethod, NeonRequest} from "../http/NeonRequest";
import {ResponseData} from "../utils";

export type MethodFunction = (req: NeonRequest, ...args: any[]) => Promise<ResponseData>

export type RouteData = {
  method: HTTPMethod,
  url: string
}

function MethodDecorator(url: string, method: HTTPMethod) {
  return (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => {
    Reflect.set(descriptor.value, "route", {
      method,
      url
    } as RouteData)
    Reflect.set(descriptor.value, "className", targetPrototype.constructor.name)
  }
}

export function Post(url: string = "") {
  return MethodDecorator(url, "POST")
}

export function Get(url: string = "") {
  return MethodDecorator(url, "GET")
}