import colors from "colors"

const LogLevel: Record<string, (str: string) => string> = {
  Error: (str: string) => colors.bgRed(colors.black(str)),
  Info: (str: string) => colors.green(str),
  Debug: (str: string) => colors.magenta(str),
  Warn: (str: string) => colors.bgYellow.black(str)
}

export class Logger {
  protected constructor(name: string) {
    this._name = name
    this._debug = true
  }

  private _print(level: string, ...args: any[]) {
    console.log(`[${new Date().toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, {
      hour12: false,
      dateStyle: "medium",
      timeStyle: "long"
    })}] ${LogLevel[level](`[${this._name} / ${level}]`)} ->`, ...args)
  }

  debugDisabled(val: boolean) {
    this._debug = !val
  }

  log(...args: string[]) {
    this._print("Info", ...args)
  }

  error(...args: any[]) {
    this._print("Error", ...args)
  }

  debug(...args: any[]) {
    if (this._debug) this._print("Debug", ...args)
  }

  warn(...args: any[]) {
    this._print("Warn", ...args)
  }

  private readonly _name: string
  private _debug: boolean

  static get(name: string) {
    return new Logger(name)
  }
}