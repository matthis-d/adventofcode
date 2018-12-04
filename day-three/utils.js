const fs = require('fs');
const readline = require('readline');

const getPosition = line => {
  const regex = /#(\d+) @ (\d+),(\d+)\: (\d+)x(\d+)/;
  const results = regex.exec(line);
  return {
    id: results[1],
    x: parseInt(results[2], 10),
    y: parseInt(results[3], 10),
    width: parseInt(results[4], 10),
    height: parseInt(results[5], 10),
  };
};

const initTable = (size = 1000) => {
  const table = [];
  for (let i = 0; i < size; i++) {
    table[i] = [];
    for (let j = 0; j < size; j++) {
      table[i].push('.');
    }
  }
  return table;
};

const drawPositions = (entries, size = 1000) => {
  const table = initTable(size);
  const positions = entries.map(getPosition);
  positions.forEach(({ x, y, width, height }) => {
    for (let j = y; j < y + height; j++) {
      for (let i = x; i < x + width; i++) {
        table[j][i] = table[j][i] === '.' ? '#' : 'X';
      }
    }
  });
  return table;
};

const willConflict = (table, position) => {
  return table
    .filter(
      (line, index) =>
        position.y <= index && index < position.y + position.height
    )
    .some(line =>
      line
        .filter(
          (elem, idx) => position.x <= idx && idx < position.x + position.width
        )
        .some(elem => elem !== '.')
    );
};

const getNotConflictedPositionId = (entries, size = 1000) => {
  const table = initTable(size);
  const positions = entries.map(getPosition);
  let result;
  positions.forEach(({ id, x, y, width, height }) => {
    const character = willConflict(table, { x, y, width, height }) ? 'X' : id;
    for (let j = y; j < y + height; j++) {
      for (let i = x; i < x + width; i++) {
        table[j][i] = character;
      }
    }

    if (character === id) {
      result = id;
    }
  });
  return result;
};

const countConflicts = output =>
  output.split('').filter(letter => letter === 'X').length;

const getEntries = filename => {
  return new Promise((resolve, reject) => {
    const entries = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });

    rl.on('line', line => {
      entries.push(line);
    });

    rl.on('close', () => {
      resolve(entries);
    });

    rl.on('error', reject);
  });
};

module.exports = {
  getPosition,
  drawPositions,
  countConflicts,
  getEntries,
  getNotConflictedPositionId,
};
