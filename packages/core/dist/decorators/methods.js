"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Json = exports.BodyType = exports.Get = exports.Post = void 0;
function MethodDecorator(url, method) {
    return (targetPrototype, prototypeKey, descriptor) => {
        Reflect.set(descriptor.value, "route", {
            method,
            url
        });
        Reflect.set(descriptor.value, "className", targetPrototype.constructor.name);
    };
}
function Post(url = "") {
    return MethodDecorator(url, "POST");
}
exports.Post = Post;
function Get(url = "") {
    return MethodDecorator(url, "GET");
}
exports.Get = Get;
function BodyType(type) {
    return (targetPrototype, prototypeKey, descriptor) => {
        Reflect.set(descriptor.value, "bodyType", type);
    };
}
exports.BodyType = BodyType;
function Json() {
    return BodyType("application/json");
}
exports.Json = Json;
//# sourceMappingURL=methods.js.map