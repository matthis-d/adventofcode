import * as fs from 'fs';
import * as readline from 'readline';

interface Position {
  id: number;
  x: number;
  y: number;
  area?: number;
}

export function getEntries(file: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      crlfDelay: Infinity,
    });

    const result: string[] = [];
    rl.on('line', line => {
      result.push(line);
    });

    rl.on('close', () => {
      resolve(result);
    });

    rl.on('error', reject);
  });
}

export const convertToPosition = (
  input: string,
  index: number = 0
): Position => {
  const matches = /(\d+), (\d+)/.exec(input);
  return {
    id: index,
    x: parseInt(matches[1], 10),
    y: parseInt(matches[2], 10),
  };
};

export const getPositions = (entries: string[]): Array<Position> =>
  entries.map(convertToPosition);

const getMax = (positions, key): number =>
  positions.reduce((max, pos) => Math.max(max, pos[key]), 0);

const getMaxX = (positions: Array<Position>): number => getMax(positions, 'x');

const getMaxY = (positions: Array<Position>): number => getMax(positions, 'y');

const initArray = (width: number, height: number): string[][] => {
  const result = [];
  for (let i = 0; i <= height; i++) {
    result.push([]);
    for (let j = 0; j <= width; j++) {
      result[i].push('.');
    }
  }
  return result;
};

export const getBaseGrid = (positions: Array<Position>): string[][] => {
  const width = getMaxX(positions);
  const height = getMaxY(positions);

  const baseGrid = initArray(width, height);

  positions.forEach(pos => {
    baseGrid[pos.y][pos.x] = `${pos.id}`;
  });

  return baseGrid;
};

export const getDistanceToPosition = (
  position: Position,
  x: number,
  y: number
): number => Math.abs(x - position.x) + Math.abs(y - position.y);

export const findClosestPosition = (
  positions: Array<Position>,
  x: number,
  y: number
): number | null => {
  let shortestDistance: number = Infinity;
  let closestPositions: Array<Position> = [];

  for (let position of positions) {
    const distance = getDistanceToPosition(position, x, y);
    if (distance < shortestDistance) {
      closestPositions = [position];
      shortestDistance = distance;
    } else if (distance === shortestDistance) {
      closestPositions.push(position);
    }
  }

  if (closestPositions.length === 0 || closestPositions.length > 1) {
    return null;
  }

  return closestPositions[0].id;
};

export const getGridWithClosestPositions = (
  positions: Array<Position>
): Array<Array<string>> => {
  const width = getMaxX(positions);
  const height = getMaxY(positions);

  const baseGrid = initArray(width, height);

  for (let y = 0; y < baseGrid.length; y++) {
    for (let x = 0; x < baseGrid[y].length; x++) {
      const closestPosId = findClosestPosition(positions, x, y);
      baseGrid[y][x] = closestPosId !== null ? `${closestPosId}` : '.';
    }
  }

  return baseGrid;
};

export const getGridColumn = (grid: string[][], index: number): string[] =>
  grid.map(line => line[index]);

export const getFiniteSurfacesIds = (
  positions: Array<Position>,
  grid?: string[][]
): number[] => {
  let currentGrid = grid;
  if (!grid) {
    currentGrid = getGridWithClosestPositions(positions);
  }

  const positionIds = positions.map(pos => pos.id);
  return positionIds
    .filter(posId => currentGrid[0].indexOf(`${posId}`) < 0)
    .filter(posId => getGridColumn(currentGrid, 0).indexOf(`${posId}`) < 0)
    .filter(
      posId =>
        getGridColumn(currentGrid, currentGrid[0].length - 1).indexOf(
          `${posId}`
        ) < 0
    )
    .filter(
      posId => currentGrid[currentGrid.length - 1].indexOf(`${posId}`) < 0
    );
};

export const getWidestSurface = (input: string[]): number => {
  const positions = getPositions(input);
  const grid = getGridWithClosestPositions(positions);
  const surfacesIds = getFiniteSurfacesIds(positions, grid);

  const allPositions = [].concat(...grid.map(line => line));

  return surfacesIds.reduce((max, posId) => {
    const surface = allPositions.filter(pos => pos === `${posId}`).length;
    return Math.max(surface, max);
  }, 0);
};
