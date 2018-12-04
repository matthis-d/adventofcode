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

const drawPosition = (position, table, defaultSymbol = '#') => {
  const { x, y, width, height } = position;
  for (let j = y; j < y + height; j++) {
    for (let i = x; i < x + width; i++) {
      table[j][i] = table[j][i] === '.' ? defaultSymbol : 'X';
    }
  }
  return table;
};

const getSurface = position => {
  return position.height * position.width;
};

const drawPositions = (entries, size = 1000, getDefaultSymbol = () => '#') => {
  const table = initTable(size);
  const positions = entries.map(getPosition);
  return positions.reduce(
    (prevTable, position) =>
      drawPosition(position, prevTable, getDefaultSymbol(position)),
    table
  );
};

const countSymbolInArray = symbol => array =>
  array.filter(letter => letter === symbol).length;

const countSymbol = symbol => output =>
  countSymbolInArray(symbol)(output.split(''));

const countConflicts = countSymbol('X');

const getNotConflictedPositionId = (entries, size) => {
  const positions = entries.map(getPosition);
  const generatedTable = drawPositions(entries, size, position => position.id);
  const inlineArray = [].concat(...generatedTable.map(line => line));

  const notConflictedPos = positions.find(
    position =>
      countSymbolInArray(position.id)(inlineArray) === getSurface(position)
  );

  return notConflictedPos.id;
};

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
