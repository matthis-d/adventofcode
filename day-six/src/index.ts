import * as path from 'path';
import { getEntries, getWidestSurface } from './utils';

getEntries(path.resolve(__dirname, '../input.txt'))
  .then(input => {
    console.log(`Widest surface is ${getWidestSurface(input)}`);
  })
  .catch(console.error);
