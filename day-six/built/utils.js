"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
function getEntries(file) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(file),
            crlfDelay: Infinity,
        });
        const result = [];
        rl.on('line', line => {
            result.push(line);
        });
        rl.on('close', () => {
            resolve(result);
        });
        rl.on('error', reject);
    });
}
exports.getEntries = getEntries;
exports.convertToPosition = (input, index = 0) => {
    const matches = /(\d+), (\d+)/.exec(input);
    return {
        id: index,
        x: parseInt(matches[1], 10),
        y: parseInt(matches[2], 10),
    };
};
exports.getPositions = (entries) => entries.map(exports.convertToPosition);
const getMax = (positions, key) => positions.reduce((max, pos) => Math.max(max, pos[key]), 0);
const getMaxX = (positions) => getMax(positions, 'x');
const getMaxY = (positions) => getMax(positions, 'y');
const initArray = (width, height) => {
    const result = [];
    for (let i = 0; i <= height; i++) {
        result.push([]);
        for (let j = 0; j <= width; j++) {
            result[i].push('.');
        }
    }
    return result;
};
exports.getBaseGrid = (positions) => {
    const width = getMaxX(positions);
    const height = getMaxY(positions);
    const baseGrid = initArray(width, height);
    positions.forEach(pos => {
        baseGrid[pos.y][pos.x] = `${pos.id}`;
    });
    return baseGrid;
};
exports.getDistanceToPosition = (position, x, y) => Math.abs(x - position.x) + Math.abs(y - position.y);
exports.findClosestPosition = (positions, x, y) => {
    let shortestDistance = Infinity;
    let closestPositions = [];
    for (let position of positions) {
        const distance = exports.getDistanceToPosition(position, x, y);
        if (distance < shortestDistance) {
            closestPositions = [position];
            shortestDistance = distance;
        }
        else if (distance === shortestDistance) {
            closestPositions.push(position);
        }
    }
    if (closestPositions.length === 0 || closestPositions.length > 1) {
        return null;
    }
    return closestPositions[0].id;
};
exports.getGridWithClosestPositions = (positions) => {
    const width = getMaxX(positions);
    const height = getMaxY(positions);
    const baseGrid = initArray(width, height);
    for (let y = 0; y < baseGrid.length; y++) {
        for (let x = 0; x < baseGrid[y].length; x++) {
            const closestPosId = exports.findClosestPosition(positions, x, y);
            baseGrid[y][x] = closestPosId !== null ? `${closestPosId}` : '.';
        }
    }
    return baseGrid;
};
exports.getGridColumn = (grid, index) => grid.map(line => line[index]);
exports.getFiniteSurfacesIds = (positions, grid) => {
    let currentGrid = grid;
    if (!grid) {
        currentGrid = exports.getGridWithClosestPositions(positions);
    }
    const positionIds = positions.map(pos => pos.id);
    return positionIds
        .filter(posId => currentGrid[0].indexOf(`${posId}`) < 0)
        .filter(posId => exports.getGridColumn(currentGrid, 0).indexOf(`${posId}`) < 0)
        .filter(posId => exports.getGridColumn(currentGrid, currentGrid[0].length - 1).indexOf(`${posId}`) < 0)
        .filter(posId => currentGrid[currentGrid.length - 1].indexOf(`${posId}`) < 0);
};
exports.getWidestSurface = (input) => {
    const positions = exports.getPositions(input);
    const grid = exports.getGridWithClosestPositions(positions);
    const surfacesIds = exports.getFiniteSurfacesIds(positions, grid);
    const allPositions = [].concat(...grid.map(line => line));
    return surfacesIds.reduce((max, posId) => {
        const surface = allPositions.filter(pos => pos === `${posId}`).length;
        return Math.max(surface, max);
    }, 0);
};
