import { cleanup, findShortestCleanup } from './utils';
import input from './input';

console.log(`Part 1 result: ${cleanup(input).length}`);
console.log(`Part 2 result: ${findShortestCleanup(input).length}`);
