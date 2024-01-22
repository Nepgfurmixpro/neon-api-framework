import { MethodFunction } from "./decorators/methods";
import { HTTPMethod } from "./http/NeonRequest";
export type RouteParam = {
    index: number;
    name: string;
    type: "body" | "path" | "query";
};
export type Route = {
    parameters: RouteParam[];
    method: HTTPMethod;
    func: MethodFunction;
    path: string;
    bodyType?: string;
};
export declare class NeonController {
    constructor();
    protected readonly _routes: Route[];
    protected _basePath: string;
    GetRoutes(baseUrl?: string): Route[];
}
