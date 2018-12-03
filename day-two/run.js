const { checksum, getCommonAmongList } = require('./index');

checksum('./input.txt')
  .then(result => console.log(`Checksum is ${result}`))
  .catch(console.error);

getCommonAmongList('./input.txt')
  .then(commons => console.log(`Commons are ${commons}`))
  .catch(console.error);
