const {
  canBeDeleted,
  cleanupLine,
  cleanup,
  removeLetter,
  findShortestCleanup,
} = require('../utils');

describe('canBeDeleted', () => {
  it('should return true with a and A', () => {
    expect(canBeDeleted('a', 'A')).toBe(true);
    expect(canBeDeleted('A', 'a')).toBe(true);
  });

  it('should return true with A and A or a and a', () => {
    expect(canBeDeleted('a', 'a')).toBe(false);
    expect(canBeDeleted('A', 'A')).toBe(false);
  });
});

describe('cleanupLine', () => {
  it('should remove only 2 by 2 letters', () => {
    expect(cleanupLine('cCc')).toEqual('c');
  });

  it('should cleanup a line correctly', () => {
    expect(cleanupLine('dabAcCaCBAcCcaDA')).toEqual('dabAaCBAcaDA');
  });
});

describe('cleanup', () => {
  it('should completely cleanup the input', () => {
    expect(cleanup('dabAcCaCBAcCcaDA')).toEqual('dabCBAcaDA');
  });
});

describe('removeLetter', () => {
  it('should remove all occurences of a or A', () => {
    expect(removeLetter('dabAcCaCBAcCcaDA', 'a')).toEqual('dbcCCBcCcD');
  });
});

describe('findShortestCleanup', () => {
  it('should return daDA', () => {
    expect(findShortestCleanup('dabAcCaCBAcCcaDA')).toEqual('daDA');
  });
});
