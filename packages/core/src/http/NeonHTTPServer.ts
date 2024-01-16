import {Route} from "../NeonController";
import NeonRequest, {HTTPMethod, LOCAL_HOST} from "./NeonRequest";
import * as http from "http";
import { v4 as createUUID } from "uuid"
import {
  formatNativeRequest,
  formatRequest,
  formatRoute,
  formatRoutes, getFunctionFromResponse,
  getPathParams,
  PATH_PARAM_REGEX,
  splitPath
} from "../utils";
import Logger from "../logger";
import * as path from "path";
import NeonResponse, {json} from "./NeonResponse";
import ResponseError from "../errors/ResponseError";

interface EventMap {
  'ready': () => void,
  'error': (code: number, request: NeonRequest, response: NeonResponse) => void
}

export default class NeonHTTPServer {
  constructor(port: number, routes: Route[]) {
    this._routes = routes
    this._port = port
    this._logger = Logger.get("HTTP")
    this._requestLogger = Logger.get("HTTP Request")
    this._httpServer = http.createServer((req, res) => {
      let time = performance.now()
      this.processRequest(req, res)
      let resTime = Math.round(performance.now() - time)
      this._logger.debug(`Response Took: ${resTime < 100 ? `${resTime}ms`.green : `${resTime}ms`.red}`)
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

  private dispatchRequest(route: Route, request: NeonRequest, response: NeonResponse) {
    const pathParams = getPathParams(route.path, request.getPath())
    let args: any[] = new Array(pathParams.length)
    route.parameters.forEach((param) => {
      if (param.type == "path") {
        args[param.index-1] = decodeURI(pathParams
          .find((val) => val.name == param.name)?.value ?? "")
      }
    })
    this._requestLogger.log(`${formatRequest(request, route)}`)
    const sendData = (data: any) => {
      response.send(data).then(() => {
        //this._requestLogger.log(`${`${response.getStatus()}`.padEnd(8, " ")} ${request.getPath().blue.underline}`)
      }).catch((err) => {
        this._requestLogger.error("Failed to send response. See error below.")
        this._requestLogger.error(err)
      })
    }
    try {
      route.func.apply(this, [request, ...args]).then((funcOrObj) => {
        response.setStatus(200)
        sendData(getFunctionFromResponse(funcOrObj)(response))
      }).catch((err: ResponseError | any) => {
        if (err instanceof ResponseError) {
          let data = getFunctionFromResponse(err.data)(response)
          response.setStatus(err.status)
          sendData(data)
        } else {
          this.Emit("error", 500, request, response)
        }
      })
    } catch (e) {
      this._logger
      this.Emit("error", 500, request, response)
    }
  }

  private processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const path = new URL(req.url ?? "/", LOCAL_HOST).pathname
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
    const request = new NeonRequest({
      method: req.method!.toUpperCase() as HTTPMethod,
      headers: req.headers as Record<string, string>,
      host: req.headers.host ?? "",
      path: path,
      ip: req.socket.remoteAddress ?? "",
    })
    if (moreLikely.length == 1) {
      const route = moreLikely[0]
      this.dispatchRequest(route, request, new NeonResponse(res))
    } else if (moreLikely.length > 1) {

    } else {
      this._requestLogger.error(`${"404".red} ${formatNativeRequest(req.method!.toUpperCase() as HTTPMethod, path)}`)
      this.Emit("error", 404, request, new NeonResponse(res))
    }
  }

  Start() {
    this._httpServer.listen(this._port)
  }

  private readonly _routes: Route[]
  private readonly _httpServer: http.Server
  private readonly _port: number
  private readonly _logger: Logger
  private readonly _requestLogger: Logger
  private _eventListeners: {
    uuid: string,
    name: string,
    func: EventMap[keyof EventMap]
  }[] = []
}