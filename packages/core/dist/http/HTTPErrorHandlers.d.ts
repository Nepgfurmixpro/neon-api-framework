import { NeonRequest } from "./NeonRequest";
import { ResponseData } from "../utils";
import { StatusResponse } from "./StatusResponse";
export declare class HTTPErrorHandlers {
    Error(req: NeonRequest, err: any): StatusResponse;
    NotFound(req: NeonRequest): ResponseData;
}
