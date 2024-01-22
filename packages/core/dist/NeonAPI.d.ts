import { NeonRouter, NeonRouteType, RouterRoutes } from "./NeonRouter";
interface APIOptions {
    "CaseSensitive": boolean;
}
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
    private _routers;
    private _apiOptions;
    private _server;
}
export declare const NeonFramework: NeonAPI;
export {};
