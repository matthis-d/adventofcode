import {
  getPositions,
  getBaseGrid,
  getGridWithClosestPositions,
  findClosestPosition,
  getFiniteSurfacesIds,
  getWidestSurface,
  getCloseToOthersPositionsCount,
} from '../utils';

describe('day 6', () => {
  let input;

  beforeEach(() => {
    input = ['1, 1', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9'];
  });

  test('getPositions should convert input into positions', () => {
    expect(getPositions(input)).toEqual([
      { id: 0, x: 1, y: 1 },
      { id: 1, x: 1, y: 6 },
      { id: 2, x: 8, y: 3 },
      { id: 3, x: 3, y: 4 },
      { id: 4, x: 5, y: 5 },
      { id: 5, x: 8, y: 9 },
    ]);
  });

  test('getBaseGrid should return an array with positions and dots', () => {
    const positions = getPositions(input);
    expect(getBaseGrid(positions)).toEqual([
      ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '0', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '2'],
      ['.', '.', '.', '3', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '4', '.', '.', '.'],
      ['.', '1', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '5'],
    ]);
  });

  test('findClosestPosition', () => {
    const positions = getPositions(input);
    expect(findClosestPosition(positions, 0, 0)).toEqual(0);
  });

  test('getGridWithClosestPositions', () => {
    const positions = getPositions(input);
    expect(getGridWithClosestPositions(positions)).toEqual([
      '00000.222'.split(''),
      '00000.222'.split(''),
      '000334222'.split(''),
      '003334222'.split(''),
      '..3334422'.split(''),
      '11.344442'.split(''),
      '111.4444.'.split(''),
      '111.44455'.split(''),
      '111.44555'.split(''),
      '111.55555'.split(''),
    ]);
  });

  test('getFiniteSurfacesIds', () => {
    const positions = getPositions(input);
    expect(getFiniteSurfacesIds(positions)).toEqual([3, 4]);
  });

  test('getWidestSurface', () => {
    expect(getWidestSurface(input)).toEqual(17);
  });

  test('getCloseToOthersPositionsCount', () => {
    expect(getCloseToOthersPositionsCount(input, 30)).toEqual(16);
  });
});
