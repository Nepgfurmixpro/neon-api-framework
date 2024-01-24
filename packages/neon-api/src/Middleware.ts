import {NeonRequest} from "./http/NeonRequest";
import {NeonResponse} from "./http/NeonResponse";
import {Logger} from "./logger";

export class Middleware {
  handle(request: NeonRequest, response: NeonResponse) {
    Logger.get("Middleware").warn("Unimplemented middleware.")
  }
}