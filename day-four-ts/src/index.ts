import * as path from 'path';
import {
  getEntries,
  sortEntries,
  findMostSleepingGuard,
  findSleepiestMinuteForGuard,
} from './utils';

const inputPath = path.resolve(__dirname, '../input.txt');

getEntries(inputPath)
  .then(entries => {
    const sortedEntries = sortEntries(entries);
    const sleepiest = findMostSleepingGuard(sortedEntries);
    console.log(`The sleepiest guard is: ${sleepiest.id}`);
    console.log(`His sleepiest minute is: ${sleepiest.minute}`);
    console.log(`Solution is: ${sleepiest.id * sleepiest.minute}`);
  })
  .catch(console.error);

getEntries(inputPath)
  .then(entries => {
    const sortedEntries = sortEntries(entries);
    const sleepiest = findSleepiestMinuteForGuard(sortedEntries);
    console.log(`The sleepiest guard is: ${sleepiest.id}`);
    console.log(`His sleepiest minute is: ${sleepiest.minute}`);
    console.log(`Solution is: ${sleepiest.id * sleepiest.minute}`);
  })
  .catch(console.error);
