const {
  getEntries,
  countConflicts,
  drawPositions,
  getNotConflictedPositionId,
} = require('./utils');

getEntries('./input.txt')
  .then(entries => {
    const positions = drawPositions(entries);
    const output = positions.map(line => line.join('')).join('\n');
    const conflicts = countConflicts(output);
    console.log(`There are ${conflicts} conflicts`);
  })
  .catch(console.error);

getEntries('./input.txt')
  .then(entries => {
    const id = getNotConflictedPositionId(entries);
    console.log(`Not conflicted id is ${id}`);
  })
  .catch(console.error);
