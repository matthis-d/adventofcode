import * as path from 'path';
import {
  getEntries,
  getWidestSurface,
  getCloseToOthersPositionsCount,
} from './utils';

getEntries(path.resolve(__dirname, '../input.txt'))
  .then(input => {
    console.log(`Widest surface is ${getWidestSurface(input)}`);
    console.log(`Safe surface is ${getCloseToOthersPositionsCount(input)}`);
  })
  .catch(console.error);
