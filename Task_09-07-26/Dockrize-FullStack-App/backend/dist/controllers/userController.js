"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = void 0;
const userServices_1 = require("../services/userServices");
const fetchUser = async (req, res) => {
    try {
        const users = await (0, userServices_1.getUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.fetchUser = fetchUser;
