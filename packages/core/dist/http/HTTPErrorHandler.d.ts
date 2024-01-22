import { NeonRequest } from "./NeonRequest";
import { ResponseData } from "../utils";
import { StatusResponse } from "./StatusResponse";
export declare class HTTPErrorHandler {
    Error(req: NeonRequest, err: any): StatusResponse;
    NotFound(_req: NeonRequest): ResponseData;
}
