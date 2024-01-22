"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const logger_1 = require("./logger");
class Middleware {
    handle(request, response) {
        logger_1.Logger.get("Middleware").warn("Unimplemented middleware.");
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map