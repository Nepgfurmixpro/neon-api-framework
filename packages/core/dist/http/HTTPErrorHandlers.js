"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPErrorHandlers = void 0;
const StatusResponse_1 = require("./StatusResponse");
class HTTPErrorHandlers {
    Error(req, err) {
        return new StatusResponse_1.StatusResponse(500, {
            message: "500: Internal Server Error",
            error: err.toString()
        });
    }
    NotFound(req) {
        return {
            message: "404: Not Found"
        };
    }
}
exports.HTTPErrorHandlers = HTTPErrorHandlers;
//# sourceMappingURL=HTTPErrorHandlers.js.map