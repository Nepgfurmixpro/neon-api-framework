import {NeonRequest} from "./NeonRequest";
import {ResponseData} from "../utils";
import {StatusResponse} from "./StatusResponse";

export class HTTPErrorHandler {
  Error(req: NeonRequest, err: any): StatusResponse {
    return new StatusResponse(500, {
      message: "500: Internal Server Error",
      error: err.toString()
    })
  }

  NotFound(_req: NeonRequest): ResponseData {
    return {
      message: "404: Not Found"
    }
  }
}