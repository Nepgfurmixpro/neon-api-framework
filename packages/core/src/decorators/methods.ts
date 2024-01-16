import {HTTPMethod} from "../http/NeonRequest";

export type MethodFunction = (req: string, ...args: any[]) => Promise<any>

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
  }
}

export function Post(url: string = "") {
  return MethodDecorator(url, "POST")
}

export function Get(url: string = "") {
  return MethodDecorator(url, "GET")
}

export function BodyType(type: string) {
  return (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => {
    Reflect.set(descriptor.value, "bodyType", type)
  }
}

export function Json() {
  return BodyType("application/json")
}