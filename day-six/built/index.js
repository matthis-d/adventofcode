"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utils_1 = require("./utils");
utils_1.getEntries(path.resolve(__dirname, '../input.txt'))
    .then(input => {
    console.log(`Widest surface is ${utils_1.getWidestSurface(input)}`);
})
    .catch(console.error);
