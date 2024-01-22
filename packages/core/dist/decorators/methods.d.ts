import { NeonRequest, HTTPMethod } from "../http/NeonRequest";
import { ResponseData } from "../utils";
export type MethodFunction = (req: NeonRequest, ...args: any[]) => Promise<ResponseData>;
export type RouteData = {
    method: HTTPMethod;
    url: string;
};
export declare function Post(url?: string): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
export declare function Get(url?: string): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
export declare function BodyType(type: string): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
export declare function Json(): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
