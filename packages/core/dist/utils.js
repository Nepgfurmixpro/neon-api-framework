"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionFromResponse = exports.getPathParams = exports.PATH_PARAM_REGEX = exports.splitPath = exports.formatNativeRequestNoColor = exports.formatNativeRequest = exports.formatRequest = exports.methodColor = exports.formatRoutes = exports.formatRouteNoColor = exports.formatRoute = exports.urlJoin = void 0;
const colors_1 = __importDefault(require("colors"));
const NeonResponse_1 = require("./http/NeonResponse");
function normalize(strArray) {
    const resultArray = [];
    if (strArray.length === 0) {
        return '';
    }
    if (typeof strArray[0] !== 'string') {
        throw new TypeError('Url must be a string. Received ' + strArray[0]);
    }
    // If the first part is a plain protocol, we combine it with the next part.
    if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
        var first = strArray.shift();
        strArray[0] = first + strArray[0];
    }
    // There must be two or three slashes in the file protocol, two slashes in anything else.
    if (strArray[0].match(/^file:\/\/\//)) {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
    }
    else {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
    }
    for (var i = 0; i < strArray.length; i++) {
        let component = strArray[i];
        if (component === '') {
            continue;
        }
        if (i > 0) {
            // Removing the starting slashes for each component but the first.
            component = component.replace(/^\/+/, '');
        }
        if (i < strArray.length - 1) {
            // Removing the ending slashes for each component but the last.
            component = component.replace(/\/+$/, '');
        }
        else {
            // For the last component we will combine multiple slashes to a single one.
            component = component.replace(/\/+$/, '/');
        }
        resultArray.push(component);
    }
    var str = resultArray.join('/');
    // Each input component is now separated by a single slash except the possible first plain protocol part.
    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
    // replace ? in parameters with &
    var parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');
    return str;
}
function urlJoin(...input) {
    return normalize(input);
}
exports.urlJoin = urlJoin;
function formatRoute(route) {
    return formatRoutes([route])[0];
}
exports.formatRoute = formatRoute;
function formatRouteNoColor(route) {
    return formatRoutes([route], false)[0];
}
exports.formatRouteNoColor = formatRouteNoColor;
function formatRoutes(routes, color = true) {
    let out = [];
    let longestPath = 0;
    routes.forEach((route) => {
        longestPath = Math.max(longestPath, route.path.length);
        out.push({
            method: route.method.toUpperCase(),
            path: route.path,
            fn: [Reflect.get(route.func, "className"), route.func.name].join("."),
        });
    });
    out.forEach((val) => {
        val.path = val.path.padEnd(longestPath, " ");
    });
    return out.map((val) => color ? formatNativeRequest(val.method, val.path, val.fn) : formatNativeRequestNoColor(val.method, val.path, val.fn));
}
exports.formatRoutes = formatRoutes;
const MethodColors = {
    "post": colors_1.default.blue,
    "get": colors_1.default.green,
    "delete": colors_1.default.red
};
function methodColor(method) {
    return MethodColors[method.toLowerCase().trim()](method);
}
exports.methodColor = methodColor;
function formatRequest(req, route) {
    return formatNativeRequest(req.getMethod(), req.getPath(), route ? [Reflect.get(route.func, "className"), route.func.name].join(".") : undefined);
}
exports.formatRequest = formatRequest;
function formatNativeRequest(method, path, fn) {
    return `${methodColor(method.padEnd(8, " "))} ${path.underline.blue}${fn ? ` Fn -> ${fn.magenta}` : ""}`;
}
exports.formatNativeRequest = formatNativeRequest;
function formatNativeRequestNoColor(method, path, fn) {
    return `${method.padEnd(8, " ")} ${path}${fn ? ` Fn -> ${fn}` : ""}`;
}
exports.formatNativeRequestNoColor = formatNativeRequestNoColor;
function splitPath(path, caseSensitive = false) {
    const split = path.split("/").filter((val) => val != "");
    return split.map((val) => !caseSensitive ? val.toLowerCase() : val);
}
exports.splitPath = splitPath;
exports.PATH_PARAM_REGEX = /<.*>/;
function getPathParams(routePath, reqPath) {
    let out = [];
    const routePathSplit = splitPath(routePath, true);
    const reqPathSplit = splitPath(reqPath, true);
    routePathSplit.forEach((val, i) => {
        if (exports.PATH_PARAM_REGEX.test(val)) {
            const reqPathValue = reqPathSplit[i];
            out.push({
                name: val.slice(1, val.length - 1),
                value: reqPathValue
            });
        }
    });
    return out;
}
exports.getPathParams = getPathParams;
function getFunctionFromResponse(funcOrObj) {
    if (typeof funcOrObj === "function") {
        return funcOrObj;
    }
    else {
        return (0, NeonResponse_1.json)(funcOrObj);
    }
}
exports.getFunctionFromResponse = getFunctionFromResponse;
//# sourceMappingURL=utils.js.map