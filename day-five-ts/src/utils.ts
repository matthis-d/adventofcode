export const canBeDeleted = (
  firstLetter: string,
  secondLetter: string
): boolean => {
  const isLowerUpper =
    firstLetter.toUpperCase() === secondLetter &&
    firstLetter === secondLetter.toLowerCase();
  const isUpperLower =
    secondLetter.toUpperCase() === firstLetter &&
    secondLetter === firstLetter.toLowerCase();
  return isLowerUpper || isUpperLower;
};

export const cleanupLine = (line: string): string => {
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

export const cleanup = (line: string): string => {
  let input = line;
  while (input !== cleanupLine(input)) {
    input = cleanupLine(input);
  }
  return input;
};

export const removeLetter = (input: string, letter: string): string => {
  return input
    .split('')
    .filter(ltr => {
      return ltr.toLowerCase() !== letter.toLowerCase();
    })
    .join('');
};

export const findShortestCleanup = (input: string): string => {
  return input
    .split('')
    .map(letter => letter.toLowerCase())
    .filter((letter, index, array) => array.indexOf(letter) === index)
    .sort()
    .map(letter => removeLetter(input, letter))
    .map(cleanup)
    .reduce((acc, line) => (line.length < acc.length ? line : acc));
};
