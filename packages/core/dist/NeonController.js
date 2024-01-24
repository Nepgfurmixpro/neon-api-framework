"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonController = void 0;
const utils_1 = require("./utils");
class NeonController {
    constructor() {
        var _a, _b;
        this._routes = [];
        this._basePath = Reflect.get(Object.getPrototypeOf(this).constructor, "basePath");
        for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const property = Object.getPrototypeOf(this)[propertyName];
            if (Reflect.has(property, "route")) {
                this._routes.push({
                    method: property.route.method,
                    path: (0, utils_1.urlJoin)(this._basePath, (_a = property.route.url) !== null && _a !== void 0 ? _a : "/"),
                    parameters: (_b = property.params) !== null && _b !== void 0 ? _b : [],
                    func: property,
                    bodyType: property.bodyType
                });
            }
        }
    }
    GetRoutes(baseUrl = "") {
        return this._routes.map((val) => {
            val.path = (0, utils_1.urlJoin)(baseUrl, val.path);
            return val;
        });
    }
}
exports.NeonController = NeonController;
//# sourceMappingURL=NeonController.js.map