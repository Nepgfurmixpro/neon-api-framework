/// <reference types="node" />
import { NeonRouter, NeonRouteType, RouterRoutes } from "./NeonRouter";
import { NeonRequest } from "./http/NeonRequest";
import stream from "stream";
import { HTTPErrorHandler } from "./http/HTTPErrorHandler";
interface APIOptions {
    "CaseSensitive": boolean;
}
export type BodyParserFunction = (stream: stream.Readable, request: NeonRequest) => Promise<any>;
export type ContentTypeBuilder = () => {
    bodyType: string;
    func: BodyParserFunction;
};
export declare class NeonAPI {
    private _logger;
    constructor();
    SetOption<K extends keyof APIOptions>(name: K, value: APIOptions[K]): void;
    GetOption<K extends keyof APIOptions>(name: K): APIOptions[K];
    Listen(port?: number): void;
    AddRouter(routes: RouterRoutes | NeonRouter): void;
    AddRoutes(name: string, routes: (NeonRouteType[] | NeonRouteType)): void;
    AddRoute(route: (NeonRouteType[] | NeonRouteType)): void;
    GetRouters(): NeonRouter[];
    RegisterContentTypes(...builders: ContentTypeBuilder[]): void;
    GetBodyParser(bodyType: string): BodyParserFunction | undefined;
    SetHTTPErrorHandler(handler: HTTPErrorHandler): void;
    GetHTTPErrorHandler(): HTTPErrorHandler;
    private _routers;
    private _apiOptions;
    private _bodyParsers;
    private _server;
    private _httpErrorHandler;
}
export declare const NeonFramework: NeonAPI;
export {};
