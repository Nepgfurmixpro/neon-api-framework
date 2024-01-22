/// <reference types="node" />
import * as http from "http";
type ResponseFormatterFunction = (res: NeonResponse) => any;
export type { ResponseFormatterFunction };
export declare function json(data: any): ResponseFormatterFunction;
export declare function url(data: Record<string, any>): ResponseFormatterFunction;
export declare function html(data: string): ResponseFormatterFunction;
export declare class NeonResponse {
    constructor(res: http.ServerResponse);
    setContentType(contentType: string): void;
    setStatus(status: number): void;
    setHeader(name: string, value: string): void;
    end(): void;
    send(data: any): Promise<void>;
    getStatus(): number;
    private readonly _res;
}
