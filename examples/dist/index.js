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
const core_1 = require("@neon-api/core");
let Users = class Users extends core_1.NeonController {
    CreateUser(req, id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id != "1") {
                throw new core_1.StatusResponse(400, {
                    message: "ID must be 1",
                    code: 1000
                });
            }
            return {
                name, id
            };
        });
    }
    GetUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: "Gavin",
                gay: true
            };
        });
    }
    GetAllUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    (0, core_1.Get)("/<id>/<name>"),
    (0, core_1.Json)(),
    __param(1, (0, core_1.Path)("id")),
    __param(2, (0, core_1.Path)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.NeonRequest, String, String]),
    __metadata("design:returntype", Promise)
], Users.prototype, "CreateUser", null);
__decorate([
    (0, core_1.Get)("/test/shouldBePickedFirst"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.NeonRequest]),
    __metadata("design:returntype", Promise)
], Users.prototype, "GetUser", null);
__decorate([
    (0, core_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.NeonRequest]),
    __metadata("design:returntype", Promise)
], Users.prototype, "GetAllUsers", null);
Users = __decorate([
    (0, core_1.Controller)("/users")
], Users);
core_1.NeonFramework.AddRoutes("/api/v1", [
    Users
]);
core_1.NeonFramework.Listen();
