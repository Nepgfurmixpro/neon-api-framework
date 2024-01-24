import { NeonController, Route } from "./NeonController";
type NeonRouteType = typeof NeonController | NeonRouter;
type RouterRoutes = Record<string, (NeonRouteType[] | NeonRouteType)> | NeonRouteType[];
export declare class NeonRouter {
    constructor(routes: RouterRoutes);
    private buildRoutes;
    getRoutes(): Route[];
    private _routes;
    private _routerRoutes;
}
export declare function createRouter(routes: RouterRoutes): NeonRouter;
export type { NeonRouteType, RouterRoutes };
