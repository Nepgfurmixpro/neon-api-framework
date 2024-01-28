import {MethodFunction} from "./decorators/methods";
import { urlJoin } from "./utils";
import {HTTPMethod} from "./http/NeonRequest";
import {NeonMiddleware} from "./NeonMiddleware";

export type RouteParam = {
  index: number,
  name: string,
  type: "body" | "path" | "query" | "middleware"
}

export type RouteMiddleware = {
  paramIdx: number,
  middleware: NeonMiddleware
}

export type Route = {
  parameters: RouteParam[],
  method: HTTPMethod,
  func: MethodFunction,
  path: string,
  bodyType?: string,
  middleware: RouteMiddleware[]
}

export class NeonController {
  constructor() {
    this._routes = []
    this._basePath = Reflect.get(
      Object.getPrototypeOf(this).constructor,
      "basePath") as string

    for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      const property = Object.getPrototypeOf(this)[propertyName]
      if (Reflect.has(property, "route")) {
        this._routes.push({
          method: property.route.method,
          path: urlJoin(this._basePath, property.route.url ?? "/"),
          parameters: property.params ?? [],
          func: property,
          bodyType: property.bodyType,
          middleware: property.middleware ?? []
        })
      }
    }
  }

  protected readonly _routes: Route[]
  protected _basePath: string

  GetRoutes(baseUrl: string = ""): Route[] {
    return this._routes.map((val) => {
      val.path = urlJoin(baseUrl, val.path)
      return val
    });
  }
}