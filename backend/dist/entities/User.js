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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = void 0;
const typeorm_1 = require("typeorm");
const PipfiUrl_1 = require("./PipfiUrl");
let UserData = class UserData extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserData.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], UserData.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], UserData.prototype, "githubUserName", void 0);
__decorate([
    typeorm_1.Column("text", { unique: true }),
    __metadata("design:type", String)
], UserData.prototype, "githubId", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], UserData.prototype, "avatarUrl", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], UserData.prototype, "email", void 0);
__decorate([
    typeorm_1.OneToMany(() => PipfiUrl_1.PipfiUrl, (t) => t.owner),
    __metadata("design:type", Promise)
], UserData.prototype, "pipfiUrls", void 0);
UserData = __decorate([
    typeorm_1.Entity()
], UserData);
exports.UserData = UserData;
//# sourceMappingURL=User.js.map