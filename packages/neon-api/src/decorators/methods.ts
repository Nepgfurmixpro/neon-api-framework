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

const Post = (url: string = "") => MethodDecorator(url, "POST")
const Put = (url: string = "") => MethodDecorator(url, "PUT")
const Patch = (url: string = "") => MethodDecorator(url, "PATCH")
const Get = (url: string = "") => MethodDecorator(url, "GET")
const Delete = (url: string = "") => MethodDecorator(url, "DELETE")

export {
  Post, Put, Patch, Get, Delete
}
