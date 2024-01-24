import {Route} from "../NeonController";
import {NeonRequest, HTTPMethod, LOCAL_HOST} from "./NeonRequest";
import * as http from "node:http";
import { v4 as createUUID } from "uuid"
import {
  formatNativeRequest,
  formatRequest,
  formatRoute, formatRouteNoColor,
  formatRoutes, getFunctionFromResponse,
  getPathParams,
  PATH_PARAM_REGEX,
  splitPath
} from "../utils";
import {Logger} from "../logger";
import {NeonResponse} from "./NeonResponse";
import {StatusResponse} from "./StatusResponse";
import {HTTPErrorHandler} from "./HTTPErrorHandler";
import {NeonAPI} from "../NeonAPI";

interface EventMap {
  'ready': () => void,
  'error': (request: NeonRequest, response: NeonResponse, err: any) => void,
  'notFound': (request: NeonRequest, response: NeonResponse) => void
}

export class NeonHTTPServer {
  constructor(port: number, routes: Route[], api: NeonAPI) {
    this._api = api;
    this._routes = routes
    this._port = port
    this._logger = Logger.get("HTTP")
    this._requestLogger = Logger.get("HTTP Request")

    this._httpErrorHandler = api.GetHTTPErrorHandler()
    this._httpServer = http.createServer((req, res) => {
      let time = performance.now()
      try {
        this.processRequest(req, res)
      } catch (e) {
        console.log(e)
      }
      let resTime = Math.round(performance.now() - time)
      this._logger.debug(`Response Took: ${resTime < 100 ? `${resTime}ms`.green : `${resTime}ms`.red}`)
    }).on("listening", () => {
      this.Emit("ready")
    })

    const sendErrorData = (response: NeonResponse, data: any) => {
      response.send(data).catch((err) => {
        this._logger.error("Failed to send error response.")
        this._logger.error(err)
      })
    }

    this.On("error", (request, response, err) => {
      const res = this._httpErrorHandler.Error(request, err)
      response.setStatus(res.status)
      sendErrorData(response, getFunctionFromResponse(res.data)(response))
    })

    this.On("notFound", (request, response) => {
      const res = this._httpErrorHandler.NotFound(request)
      response.setStatus(404)
      sendErrorData(response, getFunctionFromResponse(res)(response))
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

  private async dispatchRequest(route: Route, request: NeonRequest, response: NeonResponse) {
    const pathParams = getPathParams(route.path, request.getPath())
    let args: any[] = new Array(pathParams.length)
    let canHaveBody = false
    const method = request.getMethod()
    let body: any
    if (method == "POST" || method == "PUT" || method == "PATCH") {
      canHaveBody = true
      const parser = this._api.GetBodyParser(route.bodyType ?? "")
      if (parser) {
        body = await parser(request.getStream(), request)
      } else {
        this._logger.warn(`HTTP Content Type body parser for "${route.bodyType}" not registered.`)
      }
    }
    route.parameters.forEach((param) => {
      switch (param.type) {
        case "path": {
          args[param.index-1] = decodeURI(pathParams
            .find((val) => val.name == param.name)?.value ?? "")
          break
        }
        case "body": {
          if (canHaveBody) {
            args[param.index-1] = body
          }
          break;
        }
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
        if (funcOrObj) {
          response.setStatus(200)
          sendData(getFunctionFromResponse(funcOrObj)(response))
        } else {
          this._requestLogger.warn(`Route ${formatRoute(route)} returned undefined.`)
          this.Emit("error", request, response, `Route "${formatRouteNoColor(route)}" returned undefined.`)
        }
      }).catch((err: StatusResponse | any) => {
        if (err instanceof StatusResponse) {
          let data = getFunctionFromResponse(err.data)(response)
          response.setStatus(err.status)
          sendData(data)
        } else {
          this.Emit("error", request, response, err)
        }
      })
    } catch (e) {
      if (e instanceof TypeError) {
        this._requestLogger.error("TypeError emitted when calling route function.")
        this._requestLogger.error(e)
        this.Emit("error", request, response, "Internal Server Failure")
      } else {
        this.Emit("error", request, response, e)
      }
    }
  }

  private processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const caseSensitiveUrls = this._api.GetOption("CaseSensitive")
    const path = new URL(req.url ?? "/", LOCAL_HOST).pathname
    const reqPathSplit = splitPath(path, caseSensitiveUrls)
    let moreLikely = this._routes.filter((route) => {
      if (route.method.toUpperCase() != (req.method ?? "").toUpperCase()) return false
      return splitPath(route.path).length == reqPathSplit.length;
    })
    moreLikely = moreLikely.filter((route) => {
      return splitPath(route.path, caseSensitiveUrls)
        .every((val, i) =>
          val == reqPathSplit[i] || PATH_PARAM_REGEX.test(val))
    })
    if (moreLikely.length > 1) {
      moreLikely = moreLikely.filter((route) => {
        return splitPath(route.path, caseSensitiveUrls)
          .every((val, i) => val == reqPathSplit[i])
      })
    }
    const request = new NeonRequest({
      method: req.method!.toUpperCase() as HTTPMethod,
      headers: req.headers as Record<string, string>,
      host: req.headers.host ?? "",
      path: path,
      ip: req.socket.remoteAddress ?? "",
      raw: req
    })
    if (moreLikely.length == 1) {
      const route = moreLikely[0]
      this.dispatchRequest(route, request, new NeonResponse(res))
    } else {
      if (moreLikely.length > 1) {
        this._requestLogger.warn("Multiple routes found")
        formatRoutes(moreLikely).forEach((format) => {
          this._requestLogger.warn(`\t${format}`)
        })
      }
      this._requestLogger.error(`${"404".red} ${formatNativeRequest(req.method!.toUpperCase() as HTTPMethod, path)}`)
      this.Emit("notFound", request, new NeonResponse(res))
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
  private readonly _api: NeonAPI
  private _httpErrorHandler: HTTPErrorHandler
  private _eventListeners: {
    uuid: string,
    name: string,
    func: EventMap[keyof EventMap]
  }[] = []
}