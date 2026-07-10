"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const getUsers = async () => {
    const result = await database_1.default.query("SELECT * FROM users");
    return result.rows;
};
exports.getUsers = getUsers;
