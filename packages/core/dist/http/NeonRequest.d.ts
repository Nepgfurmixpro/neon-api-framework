/// <reference types="node" />
/// <reference types="node" />
import http from "http";
import stream from "stream";
type NeonHeaders = Record<string, string>;
type HTTPMethod = "GET" | "POST" | "DELETE" | "OPTIONS" | "PUT" | "CONNECT" | "PATCH";
type NeonRequestData = {
    headers: NeonHeaders;
    method: HTTPMethod;
    host: string;
    ip: string;
    path: string;
    raw: http.IncomingMessage;
};
export type { NeonHeaders, HTTPMethod, NeonRequestData };
export declare const LOCAL_HOST = "http://localhost";
export declare class NeonRequest {
    constructor({ headers, method, host, ip, path, raw }: NeonRequestData);
    getPath(): string;
    getMethod(): HTTPMethod;
    getStream(): stream.Readable;
    private _headers;
    private readonly _method;
    private _host;
    private _ip;
    private readonly _path;
    private readonly _raw;
}
