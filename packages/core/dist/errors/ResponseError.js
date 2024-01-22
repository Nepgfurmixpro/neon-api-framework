"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseError {
    constructor(status, data) {
        this.status = status;
        this.data = data;
    }
}
exports.default = ResponseError;
