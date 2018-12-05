"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utils_1 = require("./utils");
const inputPath = path.resolve(__dirname, '../input.txt');
utils_1.getEntries(inputPath)
    .then(entries => {
    const sortedEntries = utils_1.sortEntries(entries);
    const sleepiest = utils_1.findMostSleepingGuard(sortedEntries);
    console.log(`The sleepiest guard is: ${sleepiest.id}`);
    console.log(`His sleepiest minute is: ${sleepiest.minute}`);
    console.log(`Solution is: ${sleepiest.id * sleepiest.minute}`);
})
    .catch(console.error);
utils_1.getEntries(inputPath)
    .then(entries => {
    const sortedEntries = utils_1.sortEntries(entries);
    const sleepiest = utils_1.findSleepiestMinuteForGuard(sortedEntries);
    console.log(`The sleepiest guard is: ${sleepiest.id}`);
    console.log(`His sleepiest minute is: ${sleepiest.minute}`);
    console.log(`Solution is: ${sleepiest.id * sleepiest.minute}`);
})
    .catch(console.error);
