"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTypes = exports.basicContentType = exports.bodyParserFunc = exports.getStreamData = exports.UrlEncoded = exports.Json = exports.BodyType = void 0;
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
function UrlEncoded() {
    return BodyType("application/x-www-form-urlencoded");
}
exports.UrlEncoded = UrlEncoded;
function getStreamData(stream) {
    return new Promise((res, rej) => {
        let chunks = [];
        stream.on("data", (chunk) => {
            chunks.push(chunk);
        }).on("end", () => {
            res(Buffer.concat(chunks).toString());
        }).on("error", (err) => {
            rej(err);
        });
    });
}
exports.getStreamData = getStreamData;
function bodyParserFunc(cb) {
    return (stream) => new Promise((res, rej) => {
        getStreamData(stream).then((str) => {
            res(cb(str));
        }).catch(rej);
    });
}
exports.bodyParserFunc = bodyParserFunc;
function basicContentType(type, cb) {
    return () => {
        return {
            bodyType: type,
            func: bodyParserFunc(cb)
        };
    };
}
exports.basicContentType = basicContentType;
exports.ContentTypes = {
    Json: basicContentType("application/json", JSON.parse),
    UrlEncoded: basicContentType("application/x-www-form-urlencoded", (str) => {
        const params = new URLSearchParams(str);
        const out = {};
        for (const [key, value] of params.entries()) {
            out[key] = value;
        }
        return out;
    })
};
//# sourceMappingURL=bodyType.js.map