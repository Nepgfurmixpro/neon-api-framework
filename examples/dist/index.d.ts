import { NeonController, NeonRequest } from "neon-api-framework";
type TestRequest = {
    item?: string;
};
export declare class Users extends NeonController {
    CreateNewUser(req: NeonRequest, testData: any, data: TestRequest): Promise<import("neon-api-framework/dist/http/ResponseData").ResponseFormatterFunction>;
}
export {};
