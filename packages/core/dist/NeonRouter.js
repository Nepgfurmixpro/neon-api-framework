"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = exports.NeonRouter = void 0;
const utils_1 = require("./utils");
class NeonRouter {
    constructor(routes) {
        this._routes = [];
        this._routerRoutes = routes;
        this.buildRoutes();
    }
    buildRoutes(basePath = "/") {
        let routes = this._routerRoutes;
        this._routes = [];
        if (!Array.isArray(routes)) {
            routes = routes;
            for (const path of Object.keys(routes)) {
                let route = routes[path];
                if (Array.isArray(route)) {
                    route.forEach((val) => {
                        if (val instanceof NeonRouter) {
                            this._routes.push(...val.buildRoutes((0, utils_1.urlJoin)(basePath, path)));
                        }
                        else {
                            this._routes.push(...(new val().GetRoutes((0, utils_1.urlJoin)(basePath, path))));
                        }
                    });
                }
                else {
                    if (route instanceof NeonRouter) {
                        this._routes.push(...route.buildRoutes((0, utils_1.urlJoin)(basePath, path)));
                    }
                    else {
                        this._routes.push(...(new route().GetRoutes((0, utils_1.urlJoin)(basePath, path))));
                    }
                }
            }
        }
        else {
            routes = routes;
            routes.forEach((route) => {
                if (route instanceof NeonRouter) {
                    this._routes.push(...route.buildRoutes(basePath));
                }
                else {
                    this._routes.push(...(new route().GetRoutes(basePath)));
                }
            });
        }
        return this._routes;
    }
    getRoutes() {
        return this._routes;
    }
}
exports.NeonRouter = NeonRouter;
function createRouter(routes) {
    return new NeonRouter(routes);
}
exports.createRouter = createRouter;
//# sourceMappingURL=NeonRouter.js.map