type NeonHeaders = Record<string, string>;
type HTTPMethod = "GET" | "POST" | "DELETE" | "OPTIONS" | "PUT" | "CONNECT" | "PATCH";
type NeonRequestData = {
    headers: NeonHeaders;
    method: HTTPMethod;
    host: string;
    ip: string;
    path: string;
};
export type { NeonHeaders, HTTPMethod, NeonRequestData };
export declare const LOCAL_HOST = "http://localhost";
export declare class NeonRequest {
    constructor({ headers, method, host, ip, path }: NeonRequestData);
    getPath(): string;
    getMethod(): HTTPMethod;
    private _headers;
    private _method;
    private _host;
    private _ip;
    private _path;
}
