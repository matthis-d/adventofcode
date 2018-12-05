const canBeDeleted = (firstLetter, secondLetter) => {
  const isLowerUpper =
    firstLetter.toUpperCase() === secondLetter &&
    firstLetter === secondLetter.toLowerCase();
  const isUpperLower =
    secondLetter.toUpperCase() === firstLetter &&
    secondLetter === firstLetter.toLowerCase();
  return isLowerUpper || isUpperLower;
};

const cleanupLine = line => {
  let result = '';
  for (let i = 0; i < line.length; i++) {
    if (i + 1 < line.length && canBeDeleted(line[i], line[i + 1])) {
      i += 1;
    } else {
      result = result + line[i];
    }
  }
  return result;
};

const cleanup = line => {
  let input = line;
  while (input !== cleanupLine(input)) {
    input = cleanupLine(input);
  }
  return input;
};

const removeLetter = (input, letter) => {
  return input
    .split('')
    .filter(ltr => {
      return ltr.toLowerCase() !== letter.toLowerCase();
    })
    .join('');
};

const findShortestCleanup = input => {
  return input
    .split('')
    .map(letter => letter.toLowerCase())
    .filter((letter, index, array) => array.indexOf(letter) === index)
    .sort()
    .map(letter => removeLetter(input, letter))
    .map(cleanup)
    .reduce((acc, line) => (line.length < acc.length ? line : acc));
};

module.exports = {
  canBeDeleted,
  cleanupLine,
  cleanup,
  removeLetter,
  findShortestCleanup,
};
