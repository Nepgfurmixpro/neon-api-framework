import {NeonController, RouteParam} from "../NeonController";
import {MethodFunction} from "./methods";
import "reflect-metadata";

function addParam(name: string = "", type: "body" | "path" | "query") {
  return function (target: Object, methodName: string, idx: number) {
    const method = (target as any)[methodName] as MethodFunction
    let params = Reflect.get(method, "params") as RouteParam[] | undefined
    if (!params) params = [];
    params.push({
      name,
      index: idx,
      type
    })
    Reflect.set(method, "params", params)
  }
}

export function Path(name: string) {
  return addParam(name, "path")
}

export const Body = addParam("", "body")