import {NeonRequest} from "./http/NeonRequest";
import {NeonResponse} from "./http/NeonResponse";
import {Logger} from "./logger";

export class NeonMiddleware {
  async handle(request: NeonRequest, response: NeonResponse): Promise<any> {
    Logger.get("Middleware").warn("Unimplemented middleware.")
  }
}