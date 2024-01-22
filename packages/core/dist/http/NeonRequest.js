"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonRequest = exports.LOCAL_HOST = void 0;
// since i cant just use new URL without a stupid host
exports.LOCAL_HOST = "http://localhost";
class NeonRequest {
    constructor({ headers, method, host, ip, path }) {
        this._headers = headers;
        this._method = method;
        this._host = host;
        this._ip = ip;
        this._path = new URL(path, exports.LOCAL_HOST).pathname;
    }
    getPath() {
        return this._path;
    }
    getMethod() {
        return this._method;
    }
}
exports.NeonRequest = NeonRequest;
//# sourceMappingURL=NeonRequest.js.map