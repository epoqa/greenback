"use strict";
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
exports.removeItemOnce = exports.generateAuthToken = void 0;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const generateAuthToken = (param) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt.sign({ _id: param.toString() }, process.env.JWT_TOKEN, { expiresIn: '6h' });
    return token;
});
exports.generateAuthToken = generateAuthToken;
const removeItemOnce = (arr, value) => {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    refreshTokens: [] = arr;
};
exports.removeItemOnce = removeItemOnce;
