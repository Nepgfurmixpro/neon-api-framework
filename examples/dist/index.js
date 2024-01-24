"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const neon_api_1 = require("neon-api");
class TestRes extends neon_api_1.StatusResponse {
    constructor() {
        super(400, {
            test: "test"
        });
    }
}
let Users = class Users extends neon_api_1.NeonController {
    CreateNewUser(req, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, neon_api_1.headers)({
                "X-Test-Header": "Testing"
            }, {
                data: "value"
            });
        });
    }
};
exports.Users = Users;
__decorate([
    (0, neon_api_1.Post)("/create"),
    (0, neon_api_1.Json)(),
    __param(1, neon_api_1.Body),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [neon_api_1.NeonRequest, Object]),
    __metadata("design:returntype", Promise)
], Users.prototype, "CreateNewUser", null);
exports.Users = Users = __decorate([
    (0, neon_api_1.Controller)("/users")
], Users);
neon_api_1.NeonFramework.AddRoutes("/api/v1", [
    Users
]);
neon_api_1.NeonFramework.RegisterContentTypes(neon_api_1.ContentTypes.Json, neon_api_1.ContentTypes.UrlEncoded);
neon_api_1.NeonFramework.Listen();
