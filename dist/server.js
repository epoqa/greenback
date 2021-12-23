"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = process.env.PORT || 3333;
app.get('/', (req, res, next) => {
    res.send('Hello World!');
});
console.log('asf');
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
