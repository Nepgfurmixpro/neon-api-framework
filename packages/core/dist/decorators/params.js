"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = exports.Path = void 0;
require("reflect-metadata");
function addParam(name = "", type) {
    return function (target, methodName, idx) {
        const method = target[methodName];
        let params = Reflect.get(method, "params");
        if (!params)
            params = [];
        params.push({
            name,
            index: idx,
            type
        });
        Reflect.set(method, "params", params);
    };
}
function Path(name) {
    return addParam(name, "path");
}
exports.Path = Path;
exports.Body = addParam("", "body");
//# sourceMappingURL=params.js.map