import { Route } from "../NeonController";
import { NeonRequest } from "./NeonRequest";
import { NeonResponse } from "./NeonResponse";
import { NeonAPI } from "../NeonAPI";
interface EventMap {
    'ready': () => void;
    'error': (request: NeonRequest, response: NeonResponse, err: any) => void;
    'notFound': (request: NeonRequest, response: NeonResponse) => void;
}
export declare class NeonHTTPServer {
    constructor(port: number, routes: Route[], api: NeonAPI);
    On<K extends keyof EventMap>(eventName: K, func: EventMap[K]): {
        Remove: () => void;
    };
    Emit<K extends keyof EventMap>(eventName: K, ...params: Parameters<EventMap[K]>): void;
    private dispatchRequest;
    private processRequest;
    Start(): void;
    private readonly _routes;
    private readonly _httpServer;
    private readonly _port;
    private readonly _logger;
    private readonly _requestLogger;
    private readonly _api;
    private _httpErrorHandler;
    private _eventListeners;
}
export {};
