import { NeonRequest } from "./http/NeonRequest";
import { NeonResponse } from "./http/NeonResponse";
export declare class Middleware {
    handle(request: NeonRequest, response: NeonResponse): void;
}
