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
exports.Todo = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Todo = class Todo extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Todo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Todo.prototype, "text", void 0);
__decorate([
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], Todo.prototype, "completed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Todo.prototype, "creatorId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (u) => u.todos),
    typeorm_1.JoinColumn({ name: "creatorId" }),
    __metadata("design:type", Promise)
], Todo.prototype, "creator", void 0);
Todo = __decorate([
    typeorm_1.Entity()
], Todo);
exports.Todo = Todo;
//# sourceMappingURL=Todo.js.map