import colors from "colors"
import ts from "typescript";

const LogLevel: Record<string, (str: string) => string> = {
  Error: (str: string) => colors.bgRed(colors.black(str)),
  Info: (str: string) => colors.green(str)
}

export default class Logger {
  protected constructor(name: string) {
    this._name = name
  }

  private _print(level: string, ...args: any[]) {
    console.log(`[${new Date().toUTCString()}] ${LogLevel[level](`[${this._name} / ${level}]`)} ->`, ...args)
  }

  log(...args: string[]) {
    this._print("Info", ...args)
  }

  error(...args: any[]) {
    this._print("Error", ...args)
  }

  private readonly _name: string

  static get(name: string) {
    return new Logger(name)
  }
}