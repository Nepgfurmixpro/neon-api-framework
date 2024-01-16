import NeonController, {Route} from "./NeonController";
import { urlJoin } from "./utils";

type NeonRouteType = typeof NeonController | NeonRouter

type RouterRoutes = Record<string, (NeonRouteType[] | NeonRouteType)> | NeonRouteType[]
export default class NeonRouter {
  constructor(routes: RouterRoutes) {
    this._routes = []
    this._routerRoutes = routes
    this.buildRoutes()
  }

  private buildRoutes(basePath: string = "/") {
    let routes = this._routerRoutes
    this._routes = []
    if (!Array.isArray(routes)) {
      routes = routes as Record<string, NeonRouteType[] | NeonRouteType>
      for (const path of Object.keys(routes)) {
        let route = routes[path]
        if (Array.isArray(route)) {
          route.forEach((val) => {
            if (val instanceof NeonRouter) {
              this._routes.push(...val.buildRoutes(urlJoin(basePath, path)))
            } else {
              this._routes.push(...(new val().GetRoutes(urlJoin(basePath, path))))
            }
          })
        } else {
          if (route instanceof NeonRouter) {
            this._routes.push(...route.buildRoutes(urlJoin(basePath, path)))
          } else {
            this._routes.push(...(new route().GetRoutes(urlJoin(basePath, path))))
          }
        }
      }
    } else {
      routes = routes as NeonRouteType[]
      routes.forEach((route) => {
        if (route instanceof NeonRouter) {
          this._routes.push(...route.buildRoutes(basePath))
        } else {
          this._routes.push(...(new route().GetRoutes(basePath)))
        }
      })
    }

    return this._routes
  }

  getRoutes() {
    return this._routes
  }

  private _routes: Route[]
  private _routerRoutes: RouterRoutes
}

export function createRouter(routes: RouterRoutes) {
  return new NeonRouter(routes)
}

export type {
  NeonRouteType,
  RouterRoutes
}