import { NeonController, NeonRequest } from "neon-api-framework";
type TestRequest = {
    item?: string;
};
export declare class Users extends NeonController {
    CreateNewUser(req: NeonRequest, test: string, data: TestRequest): Promise<import("neon-api-framework/dist/http/ResponseData").ResponseFormatterFunction>;
    NotFound(req: NeonRequest): Promise<string>;
}
export {};
