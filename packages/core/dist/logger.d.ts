export declare class Logger {
    protected constructor(name: string);
    private _print;
    log(...args: string[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    private readonly _name;
    static get(name: string): Logger;
}
