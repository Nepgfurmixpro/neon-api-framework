"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headers = exports.html = exports.url = exports.json = void 0;
const utils_1 = require("../utils");
function json(data) {
    return (res) => {
        res.setContentType("application/json");
        return JSON.stringify(data);
    };
}
exports.json = json;
function url(data) {
    return (res) => {
        res.setContentType("application/x-www-form-urlencoded");
        return new URLSearchParams(data)
            .toString();
    };
}
exports.url = url;
function html(data) {
    return (res) => {
        res.setContentType("text/html");
        return data;
    };
}
exports.html = html;
function headers(headers, data) {
    const func = (0, utils_1.getFunctionFromResponse)(data);
    return (res) => {
        for (const [name, value] of Object.entries(headers)) {
            res.setHeader(name, value);
        }
        return func(res);
    };
}
exports.headers = headers;
//# sourceMappingURL=ResponseData.js.map