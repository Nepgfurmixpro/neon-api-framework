import { NeonController, NeonRequest } from "neon-api";
type TestRequest = {
    item?: string;
};
export declare class Users extends NeonController {
    CreateNewUser(req: NeonRequest, data: TestRequest): Promise<import("../../packages/neon-api/dist/http/ResponseData").ResponseFormatterFunction>;
}
export {};
