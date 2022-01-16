"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Routers
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const diary_1 = require("./routers/diary");
const user_1 = require("./routers/user");
const merge_1 = require("./routers/merge");
// Modules
require("./db/connection");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
// Middlewares
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(user_1.userRouter);
app.use(diary_1.diaryRouter);
app.use(merge_1.mergeRouter);
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
