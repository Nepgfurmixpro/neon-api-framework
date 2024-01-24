"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPErrorHandler = void 0;
const StatusResponse_1 = require("./StatusResponse");
class HTTPErrorHandler {
    Error(req, err) {
        return new StatusResponse_1.StatusResponse(500, {
            message: "500: Internal Server Error",
            error: err.toString()
        });
    }
    NotFound(_req) {
        return {
            message: "404: Not Found"
        };
    }
}
exports.HTTPErrorHandler = HTTPErrorHandler;
//# sourceMappingURL=HTTPErrorHandler.js.map