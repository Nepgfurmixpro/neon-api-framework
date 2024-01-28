import {MethodFunction} from "./methods";
import {RouteMiddleware, RouteParam} from "../NeonController";
import {NeonMiddleware} from "../NeonMiddleware";

export function Middleware(middlewareClass: typeof NeonMiddleware) {
  return function (target: Object, methodName: string, idx: number) {
    const method = (target as any)[methodName] as MethodFunction
    let params = Reflect.get(method, "params") as RouteParam[] | undefined
    if (!params) params = [];
    params.push({
      name: "",
      index: idx,
      type: "middleware"
    })
    Reflect.set(method, "params", params)
    let middleware = Reflect.get(method, "middleware") as RouteMiddleware[] | undefined
    if (!middleware) middleware = [];
    middleware.push({
      paramIdx: idx,
      middleware: new middlewareClass
    })
    Reflect.set(method, "middleware", middleware)
  }
}
