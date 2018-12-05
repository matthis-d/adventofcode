const { cleanup, findShortestCleanup } = require('./utils');
const input = require('./input');

console.log(`Part 1 result: ${cleanup(input).length}`);
console.log(`Part 2 result: ${findShortestCleanup(input).length}`);
