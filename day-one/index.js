const fs = require('fs');
const readline = require('readline');

async function readValues(filename) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });

    let values = [];

    rl.on('line', line => {
      values.push(parseInt(line, 10));
    });

    rl.on('close', () => {
      resolve(values);
    }).on('error', reject);
  });
}

const sum = values => values.reduce((acc, val) => acc + val, 0);

const getDoubleFreq = values => {
  let index = 0;
  let currentFreq = 0;
  let storedFreqs = [0];
  while (true) {
    currentFreq = currentFreq + values[index % values.length];
    if (storedFreqs.indexOf(currentFreq) > -1) {
      return currentFreq;
    }
    storedFreqs.push(currentFreq);
    index++;
  }
};

readValues('./input.txt')
  .then(values => {
    console.log(`Step 1 finished with result: ${sum(values)}`);

    const doubleFreq = getDoubleFreq(values);
    console.log(`Step 2 finished with result: ${doubleFreq}`);
  })
  .catch(console.error);
