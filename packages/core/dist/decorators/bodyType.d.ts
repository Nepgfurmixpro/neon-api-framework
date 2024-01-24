/// <reference types="node" />
import { BodyParserFunction, ContentTypeBuilder } from "../NeonAPI";
import stream from "stream";
export declare function BodyType(type: string): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
export declare function Json(): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
export declare function UrlEncoded(): (targetPrototype: any, prototypeKey: string, descriptor: PropertyDescriptor) => void;
export declare function getStreamData(stream: stream.Readable): Promise<string>;
export declare function bodyParserFunc(cb: (str: string) => any): BodyParserFunction;
export declare function basicContentType(type: string, cb: (str: string) => any): () => {
    bodyType: string;
    func: BodyParserFunction;
};
export declare const ContentTypes: Record<"Json" | "UrlEncoded", ContentTypeBuilder>;
