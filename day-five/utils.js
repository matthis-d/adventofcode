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

module.exports = {
  canBeDeleted,
  cleanupLine,
  cleanup,
};
