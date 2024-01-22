"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonFramework = exports.NeonAPI = void 0;
const NeonRouter_1 = require("./NeonRouter");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const NeonHTTPServer_1 = require("./http/NeonHTTPServer");
const HTTPErrorHandler_1 = require("./http/HTTPErrorHandler");
const DEFAULT_PORT = 3000;
class NeonAPI {
    constructor() {
        this._logger = logger_1.Logger.get("NeonFramework");
        this._routers = [];
        this._bodyParsers = {};
        this._apiOptions = {
            CaseSensitive: false
        };
    }
    SetOption(name, value) {
        this._apiOptions[name] = value;
    }
    GetOption(name) {
        return this._apiOptions[name];
    }
    Listen(port = DEFAULT_PORT) {
        let routes = [];
        this._logger.log("Available Routes:");
        this._routers.forEach((router) => {
            routes = [...routes, ...router.getRoutes()];
        });
        (0, utils_1.formatRoutes)(routes).forEach((val) => {
            this._logger.log(`\t${val}`);
        });
        this._server = new NeonHTTPServer_1.NeonHTTPServer(port, routes, this);
        this._server.On("ready", () => {
            this._logger.log(`Started on http://0.0.0.0:${port}`);
        });
        this._server.Start();
    }
    AddRouter(routes) {
        this._routers.push(routes instanceof NeonRouter_1.NeonRouter ? routes : (0, NeonRouter_1.createRouter)(routes));
    }
    AddRoutes(name, routes) {
        let route = {};
        route[name] = routes;
        this.AddRouter(route);
    }
    AddRoute(route) {
        this.AddRouter(Array.isArray(route) ? route : [route]);
    }
    GetRouters() {
        return this._routers;
    }
    RegisterContentTypes(...builders) {
        for (const builder of builders) {
            const { bodyType, func } = builder();
            this._bodyParsers[bodyType] = func;
        }
    }
    GetBodyParser(bodyType) {
        return this._bodyParsers[bodyType];
    }
    SetHTTPErrorHandler(handler) {
        this._httpErrorHandler = handler;
    }
    GetHTTPErrorHandler() {
        var _a;
        return (_a = this._httpErrorHandler) !== null && _a !== void 0 ? _a : new HTTPErrorHandler_1.HTTPErrorHandler();
    }
}
exports.NeonAPI = NeonAPI;
exports.NeonFramework = new NeonAPI();
//# sourceMappingURL=NeonAPI.js.map