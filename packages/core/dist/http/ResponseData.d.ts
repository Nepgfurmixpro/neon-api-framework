import { NeonResponse } from "./NeonResponse";
import { NeonHeaders } from "./NeonRequest";
type ResponseFormatterFunction = (res: NeonResponse) => any;
export type { ResponseFormatterFunction };
export declare function json(data: any): ResponseFormatterFunction;
export declare function url(data: Record<string, any>): ResponseFormatterFunction;
export declare function html(data: string): ResponseFormatterFunction;
export declare function headers(headers: NeonHeaders, data: ResponseFormatterFunction | object): ResponseFormatterFunction;
