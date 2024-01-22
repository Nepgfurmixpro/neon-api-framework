"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
function Controller(basePath = "/") {
    return (targetPrototype) => {
        Reflect.set(targetPrototype, "basePath", basePath);
    };
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map