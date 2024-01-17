import NeonController, {Route} from "./NeonController";
import NeonRouter, {createRouter, NeonRouteType, RouterRoutes} from "./NeonRouter";
import Logger from "./logger";
import {formatRoutes, methodColor} from "./utils";
import NeonHTTPServer from "./http/NeonHTTPServer";

const DEFAULT_PORT = 3000

interface APIOptions {
  "CaseSensitive": boolean
}

export class NeonAPI {
  private _logger: Logger
  constructor() {
    this._logger = Logger.get("NeonFramework")
    this._routers = [];

    this._apiOptions = {
      CaseSensitive: false
    }
  }

  SetOption<K extends keyof APIOptions>(name: K, value: APIOptions[K]) {
    this._apiOptions[name] = value
  }

  GetOption<K extends keyof APIOptions>(name: K): APIOptions[K] {
    return this._apiOptions[name]
  }

  Listen(port: number = DEFAULT_PORT) {
    let routes: Route[] = []
    this._logger.log("Available Routes:")
    this._routers.forEach((router) => {
      routes = [...routes, ...router.getRoutes()]
    })
    formatRoutes(routes).forEach((val) => {
      this._logger.log(`\t${val}`)
    })
    this._server = new NeonHTTPServer(port, routes, this)

    this._server.On("ready", () => {
      this._logger.log(`Started on http://0.0.0.0:${port}`)
    })

    this._server.Start()
  }

  AddRouter(routes: RouterRoutes | NeonRouter) {
    this._routers.push(routes instanceof NeonRouter ? routes : createRouter(routes))
  }

  AddRoutes(name: string, routes: (NeonRouteType[] | NeonRouteType)) {
    let route: Record<string, (NeonRouteType[] | NeonRouteType)> = {}
    route[name] = routes
    this.AddRouter(route)
  }

  AddRoute(route: (NeonRouteType[] | NeonRouteType)) {
    this.AddRouter(Array.isArray(route) ? route : [route])
  }

  GetRouters(): NeonRouter[] {
    return this._routers
  }

  private _routers: NeonRouter[];
  private _apiOptions: Record<keyof APIOptions, APIOptions[keyof APIOptions]>
  private _server: NeonHTTPServer | undefined;
}

export const NeonFramework = new NeonAPI();