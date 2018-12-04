const { getEntries, sortEntries, findMostSleepingGuard } = require('./utils');

getEntries('./input.txt')
  .then(entries => {
    const sortedEntries = sortEntries(entries);
    const sleepiest = findMostSleepingGuard(sortedEntries);
    console.log(`The sleepiest guard is: ${sleepiest.id}`);
    console.log(`His sleepiest minute is: ${sleepiest.minute}`);
    console.log(`Solution is: ${sleepiest.id * sleepiest.minute}`);
  })
  .catch(console.error);
