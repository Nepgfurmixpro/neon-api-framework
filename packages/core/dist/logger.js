"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const colors_1 = __importDefault(require("colors"));
const LogLevel = {
    Error: (str) => colors_1.default.bgRed(colors_1.default.black(str)),
    Info: (str) => colors_1.default.green(str),
    Debug: (str) => colors_1.default.magenta(str),
    Warn: (str) => colors_1.default.bgYellow.black(str)
};
class Logger {
    constructor(name) {
        this._name = name;
    }
    _print(level, ...args) {
        console.log(`[${new Date().toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, {
            hour12: false,
            dateStyle: "medium",
            timeStyle: "long"
        })}] ${LogLevel[level](`[${this._name} / ${level}]`)} ->`, ...args);
    }
    log(...args) {
        this._print("Info", ...args);
    }
    error(...args) {
        this._print("Error", ...args);
    }
    debug(...args) {
        this._print("Debug", ...args);
    }
    warn(...args) {
        this._print("Warn", ...args);
    }
    static get(name) {
        return new Logger(name);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map