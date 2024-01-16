import {Route} from "../NeonController";
import NeonRequest from "./NeonRequest";
import * as http from "http";
import { v4 as createUUID } from "uuid"
import {getPathParams, PATH_PARAM_REGEX, splitPath} from "../utils";
import Logger from "../logger";

interface EventMap {
  'ready': () => void,
  'error': (code: number) => void
}

export default class NeonHTTPServer {
  constructor(port: number, routes: Route[]) {
    this._routes = routes
    this._port = port
    this._logger = Logger.get("HTTP")
    this._httpServer = http.createServer((req, res) => {
      this.processRequest(req, res)
    }).on("listening", () => {
      this.Emit("ready")
    })
  }

  On<K extends keyof EventMap>(eventName: K, func: EventMap[K]) {
    let uuid = createUUID()
    this._eventListeners.push({
      uuid,
      name: eventName,
      func
    })
    return {
      Remove: () => {
        this._eventListeners = this._eventListeners.filter((val) => val.uuid != uuid)
      }
    }
  }


  Emit<K extends keyof EventMap>(eventName: K, ...params: Parameters<EventMap[K]>) {
    this._eventListeners.forEach((val) => {
      if (val.name == eventName) {
        let func = val.func as (...args: Parameters<EventMap[K]>) => ReturnType<EventMap[K]>;
        func(...params)
      }
    })
  }

  private dispatchRequest(request: NeonRequest) {

  }

  private processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const path = req.url ?? "/"
    const reqPathSplit = splitPath(path)
    let moreLikely = this._routes.filter((route) => {
      if (route.method.toUpperCase() != (req.method ?? "").toUpperCase()) return false
      if (splitPath(route.path).length != reqPathSplit.length) return false;
      return true
    })
    moreLikely = moreLikely.filter((route) => {
      return splitPath(route.path)
        .every((val, i) =>
          val == reqPathSplit[i] || PATH_PARAM_REGEX.test(val))
    })
    if (moreLikely.length == 1) {
      const route = moreLikely[0]
      const params = getPathParams(route.path, path)

    } else if (moreLikely.length > 1) {

    } else {
      this._logger.error(`404 Occurred at ${path}`)
      this.Emit("error", 404)
    }
  }

  Start() {
    this._httpServer.listen(this._port)
  }

  private readonly _routes: Route[]
  private readonly _httpServer: http.Server
  private readonly _port: number
  private readonly _logger: Logger
  private _eventListeners: {
    uuid: string,
    name: string,
    func: EventMap[keyof EventMap]
  }[] = []
}