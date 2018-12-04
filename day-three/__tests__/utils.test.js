const {
  getPosition,
  drawPositions,
  countConflicts,
  getNotConflictedPositionId,
} = require('../utils');

describe('getPosition', () => {
  test('#123 @ 3,2: 5x4', () => {
    expect(getPosition('#123 @ 3,2: 5x4')).toEqual({
      id: '123',
      x: 3,
      y: 2,
      width: 5,
      height: 4,
    });
  });
});

describe('drawPositions', () => {
  test('with the example input', () => {
    const entries = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'];
    const size = 8;
    const positions = drawPositions(entries, size);
    const output = positions.map(line => line.join('')).join('\n');
    expect(output).toEqual(`........
...####.
...####.
.##XX##.
.##XX##.
.######.
.######.
........`);
  });
});

describe('countConflicts', () => {
  test('4 conflicts with example', () => {
    expect(
      countConflicts(`........
    ...####.
    ...####.
    .##XX##.
    .##XX##.
    .######.
    .######.
    ........`)
    ).toEqual(4);
  });
});

describe('getNotConflictedPositionId', () => {
  test('with the example input', () => {
    const entries = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'];
    const size = 8;
    const notConflicted = getNotConflictedPositionId(entries, size);
    expect(notConflicted).toEqual('3');
  });
});
