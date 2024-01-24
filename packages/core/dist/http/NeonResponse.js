"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonResponse = exports.html = exports.url = exports.json = void 0;
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
class NeonResponse {
    constructor(res) {
        this._res = res;
    }
    setContentType(contentType) {
        this._res.setHeader("Content-Type", contentType);
    }
    setStatus(status) {
        this._res.statusCode = status;
    }
    setHeader(name, value) {
        this._res.setHeader(name, value);
    }
    end() {
        this._res.end();
    }
    send(data) {
        return new Promise((res, rej) => {
            this.setHeader("Connection", "close");
            this._res.write(data, (err) => {
                if (err)
                    rej(err.message);
                else
                    res();
                this.end();
            });
        });
    }
    getStatus() {
        return this._res.statusCode;
    }
}
exports.NeonResponse = NeonResponse;
//# sourceMappingURL=NeonResponse.js.map