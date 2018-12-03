const fs = require('fs');
const readline = require('readline');

const hasSameLetters = count => word => {
  const letters = word.split('');

  const counter = letters.reduce((acc, letter) => {
    return {
      ...acc,
      [letter]: acc[letter] ? acc[letter] + 1 : 1,
    };
  }, {});

  return Object.values(counter).includes(count);
};

const hasTwoSameLetters = hasSameLetters(2);
const hasThreeSameLetters = hasSameLetters(3);

const checksum = async filename => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });

    let twoLetters = 0;
    let threeLetters = 0;

    rl.on('line', line => {
      if (hasTwoSameLetters(line)) {
        twoLetters++;
      }
      if (hasThreeSameLetters(line)) {
        threeLetters++;
      }
    });

    rl.on('close', () => {
      resolve(twoLetters * threeLetters);
    });

    rl.on('error', reject);
  });
};

const getStringWithoutIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)].join('');
};

const areClose = (id1, id2) => {
  const chars1 = id1.split('');
  const chars2 = id2.split('');
  const differed = chars1.filter(
    (letter, index) =>
      chars2.indexOf(letter) < 0 &&
      getStringWithoutIndex(chars2, index) ===
        getStringWithoutIndex(chars1, index)
  );
  return differed.length === 1;
};

const getCommonLetters = (id1, id2) => {
  const chars1 = id1.split('');
  const chars2 = id2.split('');
  const differed = chars1.filter(letter => chars2.indexOf(letter) > -1);
  return differed.join('');
};

const getCommonAmongList = async filename => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });

    const handled = [];

    rl.on('line', line => {
      for (const text of handled) {
        if (areClose(text, line)) {
          return resolve(getCommonLetters(text, line));
        }
      }
      handled.push(line);
    });

    rl.on('close', () => {
      resolve('nothing found');
    });

    rl.on('error', reject);
  });
};

module.exports = {
  hasTwoSameLetters,
  hasThreeSameLetters,
  checksum,
  areClose,
  getCommonLetters,
  getCommonAmongList,
  getStringWithoutIndex,
};
