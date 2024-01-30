import {HTTPMethod, NeonMiddleware, NeonRequest, NeonResponse} from "neon-api-framework";

type OriginFunction = (origin: string) => string;

type CorsOptions = {
  AllowCredentials?: boolean,
  AllowMethods?: HTTPMethod[],
  MaxAge?: number,
  ExposeHeaders?: string[],
  AllowOrigin?: string | string[] | OriginFunction,
  AllowHeaders?: string[]
}

export class NeonCors extends NeonMiddleware {
  constructor(options: CorsOptions) {
    super()
    this._options = options
  }

  HandleCredentials(res: NeonResponse) {
    if (this._options.AllowCredentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true")
    }
  }

  HandleMethods(res: NeonResponse) {
    if (this._options.AllowMethods) {
      res.setHeader("Access-Control-Allow-Methods", this._options.AllowMethods.join(", "))
    }
  }

  HandleOrigin(req: NeonRequest, res: NeonResponse) {
    if (this._options.AllowOrigin) {
      const allowOrigin = this._options.AllowOrigin
      let origin = ""
      if (typeof allowOrigin == "string") {
        origin = allowOrigin
      } else if (Array.isArray(allowOrigin)) {
        const fromOrigin = req.getHeader("Origin") as string
        if (allowOrigin.includes(fromOrigin)) {
          origin = fromOrigin
        } else {
          origin = allowOrigin[0] ?? ""
        }
      } else {
        origin = allowOrigin(req.getHeader("Origin") as string)
      }
      if (origin != "") {
        res.setHeader("Access-Control-Allow-Origin", origin)
        if (typeof allowOrigin != "string") {
          res.setHeader("Vary", "Origin")
        }
      }
    }
  }

  HandleExpose(res: NeonResponse) {
    if (this._options.ExposeHeaders) {
      res.setHeader("Access-Control-Expose-Headers", this._options.ExposeHeaders.join(", "))
    }
  }

  HandleMaxAge(res: NeonResponse) {
    if (this._options.MaxAge) {
      res.setHeader("Access-Control-Max-Age", this._options.MaxAge.toString())
    }
  }

  HandleHeaders(req: NeonRequest, res: NeonResponse) {
    if (!this._options.AllowHeaders) {
      res.setHeader("Vary", "Access-Control-Request-Headers")
      res.setHeader("Access-Control-Allow-Headers", req.getHeader("Access-Control-Request-Headers") as string | undefined ?? "")
      return
    }
    if (this._options.AllowHeaders) {
      res.setHeader("Access-Control-Allow-Headers", this._options.AllowHeaders.join(", "))
    }
  }

  override async handle(req: NeonRequest, res: NeonResponse): Promise<any> {
    this.HandleOrigin(req, res)
    this.HandleCredentials(res)
    this.HandleExpose(res)

    if (req.getMethod() == "OPTIONS") {
      if (!this._options.AllowMethods) this._options.AllowMethods = ["GET", "DELETE", "PUT", "PATCH", "POST"];
      this.HandleMaxAge(res)
      this.HandleMethods(res)
      this.HandleHeaders(req, res)
      res.end()
    }
  }

  private _options: CorsOptions
}

export const createCors = (options: CorsOptions) => {
  return new NeonCors(options)
}