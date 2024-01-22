"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonHTTPServer = void 0;
const NeonRequest_1 = require("./NeonRequest");
const http = __importStar(require("node:http"));
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const NeonResponse_1 = require("./NeonResponse");
const StatusResponse_1 = require("./StatusResponse");
class NeonHTTPServer {
    constructor(port, routes, api) {
        this._eventListeners = [];
        this._api = api;
        this._routes = routes;
        this._port = port;
        this._logger = logger_1.Logger.get("HTTP");
        this._requestLogger = logger_1.Logger.get("HTTP Request");
        this._httpErrorHandler = api.GetHTTPErrorHandler();
        this._httpServer = http.createServer((req, res) => {
            let time = performance.now();
            this.processRequest(req, res);
            let resTime = Math.round(performance.now() - time);
            this._logger.debug(`Response Took: ${resTime < 100 ? `${resTime}ms`.green : `${resTime}ms`.red}`);
        }).on("listening", () => {
            this.Emit("ready");
        });
        const sendErrorData = (response, data) => {
            response.send(data).catch((err) => {
                this._logger.error("Failed to send error response.");
                this._logger.error(err);
            });
        };
        this.On("error", (request, response, err) => {
            const res = this._httpErrorHandler.Error(request, err);
            response.setStatus(res.status);
            sendErrorData(response, (0, utils_1.getFunctionFromResponse)(res.data)(response));
        });
        this.On("notFound", (request, response) => {
            const res = this._httpErrorHandler.NotFound(request);
            response.setStatus(404);
            sendErrorData(response, (0, utils_1.getFunctionFromResponse)(res)(response));
        });
    }
    On(eventName, func) {
        let uuid = (0, uuid_1.v4)();
        this._eventListeners.push({
            uuid,
            name: eventName,
            func
        });
        return {
            Remove: () => {
                this._eventListeners = this._eventListeners.filter((val) => val.uuid != uuid);
            }
        };
    }
    Emit(eventName, ...params) {
        this._eventListeners.forEach((val) => {
            if (val.name == eventName) {
                let func = val.func;
                func(...params);
            }
        });
    }
    dispatchRequest(route, request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pathParams = (0, utils_1.getPathParams)(route.path, request.getPath());
            let args = new Array(pathParams.length);
            let canHaveBody = false;
            const method = request.getMethod();
            let body;
            if (method == "POST" || method == "PUT" || method == "PATCH") {
                canHaveBody = true;
                const parser = this._api.GetBodyParser((_a = route.bodyType) !== null && _a !== void 0 ? _a : "");
                if (parser) {
                    body = yield parser(request.getStream(), request);
                }
                else {
                    this._logger.warn(`HTTP Content Type body parser for "${route.bodyType}" not registered.`);
                }
            }
            route.parameters.forEach((param) => {
                var _a, _b;
                switch (param.type) {
                    case "path": {
                        args[param.index - 1] = decodeURI((_b = (_a = pathParams
                            .find((val) => val.name == param.name)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
                        break;
                    }
                    case "body": {
                        if (canHaveBody) {
                            args[param.index - 1] = body;
                        }
                        break;
                    }
                }
            });
            this._requestLogger.log(`${(0, utils_1.formatRequest)(request, route)}`);
            const sendData = (data) => {
                response.send(data).then(() => {
                    //this._requestLogger.log(`${`${response.getStatus()}`.padEnd(8, " ")} ${request.getPath().blue.underline}`)
                }).catch((err) => {
                    this._requestLogger.error("Failed to send response. See error below.");
                    this._requestLogger.error(err);
                });
            };
            try {
                route.func.apply(this, [request, ...args]).then((funcOrObj) => {
                    if (funcOrObj) {
                        response.setStatus(200);
                        sendData((0, utils_1.getFunctionFromResponse)(funcOrObj)(response));
                    }
                    else {
                        this._requestLogger.warn(`Route ${(0, utils_1.formatRoute)(route)} returned undefined.`);
                        this.Emit("error", request, response, `Route "${(0, utils_1.formatRouteNoColor)(route)}" returned undefined.`);
                    }
                }).catch((err) => {
                    if (err instanceof StatusResponse_1.StatusResponse) {
                        let data = (0, utils_1.getFunctionFromResponse)(err.data)(response);
                        response.setStatus(err.status);
                        sendData(data);
                    }
                    else {
                        this.Emit("error", request, response, err);
                    }
                });
            }
            catch (e) {
                if (e instanceof TypeError) {
                    this._requestLogger.error("TypeError emitted when calling route function.");
                    this._requestLogger.error(e);
                    this.Emit("error", request, response, "Internal Server Failure");
                }
                else {
                    this.Emit("error", request, response, e);
                }
            }
        });
    }
    processRequest(req, res) {
        var _a, _b, _c;
        const caseSensitiveUrls = this._api.GetOption("CaseSensitive");
        const path = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", NeonRequest_1.LOCAL_HOST).pathname;
        const reqPathSplit = (0, utils_1.splitPath)(path, caseSensitiveUrls);
        let moreLikely = this._routes.filter((route) => {
            var _a;
            if (route.method.toUpperCase() != ((_a = req.method) !== null && _a !== void 0 ? _a : "").toUpperCase())
                return false;
            return (0, utils_1.splitPath)(route.path).length == reqPathSplit.length;
        });
        moreLikely = moreLikely.filter((route) => {
            return (0, utils_1.splitPath)(route.path, caseSensitiveUrls)
                .every((val, i) => val == reqPathSplit[i] || utils_1.PATH_PARAM_REGEX.test(val));
        });
        if (moreLikely.length > 1) {
            moreLikely = moreLikely.filter((route) => {
                return (0, utils_1.splitPath)(route.path, caseSensitiveUrls)
                    .every((val, i) => val == reqPathSplit[i]);
            });
        }
        const request = new NeonRequest_1.NeonRequest({
            method: req.method.toUpperCase(),
            headers: req.headers,
            host: (_b = req.headers.host) !== null && _b !== void 0 ? _b : "",
            path: path,
            ip: (_c = req.socket.remoteAddress) !== null && _c !== void 0 ? _c : "",
            raw: req
        });
        if (moreLikely.length == 1) {
            const route = moreLikely[0];
            this.dispatchRequest(route, request, new NeonResponse_1.NeonResponse(res));
        }
        else {
            if (moreLikely.length > 1) {
                this._requestLogger.warn("Multiple routes found");
                (0, utils_1.formatRoutes)(moreLikely).forEach((format) => {
                    this._requestLogger.warn(`\t${format}`);
                });
            }
            this._requestLogger.error(`${"404".red} ${(0, utils_1.formatNativeRequest)(req.method.toUpperCase(), path)}`);
            this.Emit("notFound", request, new NeonResponse_1.NeonResponse(res));
        }
    }
    Start() {
        this._httpServer.listen(this._port);
    }
}
exports.NeonHTTPServer = NeonHTTPServer;
//# sourceMappingURL=NeonHTTPServer.js.map