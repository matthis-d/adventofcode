const path = require('path');
const {
  hasTwoSameLetters,
  hasThreeSameLetters,
  checksum,
  areClose,
  getCommonLetters,
  getCommonAmongList,
  getStringWithoutIndex,
} = require('../index');

describe('hasTwoSameLetters', () => {
  test('abcdef should return false', () => {
    expect(hasTwoSameLetters('abcdef')).toBe(false);
  });

  test('bababc should return true', () => {
    expect(hasTwoSameLetters('bababc')).toBe(true);
  });

  test('abbcde should return true', () => {
    expect(hasTwoSameLetters('abbcde')).toBe(true);
  });

  test('abcccd should return false', () => {
    expect(hasTwoSameLetters('abcccd')).toBe(false);
  });

  test('aabcdd should return true', () => {
    expect(hasTwoSameLetters('aabcdd')).toBe(true);
  });

  test('abcdee should return true', () => {
    expect(hasTwoSameLetters('abcdee')).toBe(true);
  });

  test('ababab should return false', () => {
    expect(hasTwoSameLetters('ababab')).toBe(false);
  });
});

describe('hasThreeSameLetters', () => {
  test('abcdef should return false', () => {
    expect(hasThreeSameLetters('abcdef')).toBe(false);
  });

  test('bababc should return true', () => {
    expect(hasThreeSameLetters('bababc')).toBe(true);
  });

  test('abbcde should return false', () => {
    expect(hasThreeSameLetters('abbcde')).toBe(false);
  });

  test('abcccd should return true', () => {
    expect(hasThreeSameLetters('abcccd')).toBe(true);
  });

  test('aabcdd should return false', () => {
    expect(hasThreeSameLetters('aabcdd')).toBe(false);
  });

  test('abcdee should return false', () => {
    expect(hasThreeSameLetters('abcdee')).toBe(false);
  });

  test('ababab should return true', () => {
    expect(hasThreeSameLetters('ababab')).toBe(true);
  });
});

describe('checksum', () => {
  test('current input should return 12', async () => {
    const sum = await checksum(path.join(__dirname, './input.txt'));
    expect(sum).toBe(12);
  });
});

describe('areClose', () => {
  test('it should return false when 2 or more characters differ', () => {
    expect(areClose('abcde', 'axcye')).toBe(false);
  });

  test('it should return true when 1 character differs', () => {
    expect(areClose('fghij', 'fguij')).toBe(true);
  });
});

describe('getCommonLetters', () => {
  test('fghij and fguij has fgij in common', () => {
    expect(getCommonLetters('fghij', 'fguij')).toEqual('fgij');
  });
});

describe('getCommonAmongList', () => {
  test('input-step-2 should return fgij', async () => {
    const common = await getCommonAmongList(
      path.resolve(__dirname, './input-step-2.txt')
    );
    expect(common).toEqual('fgij');
  });
});

describe('getStringWithoutIndex', () => {
  test('fghij', () => {
    expect(getStringWithoutIndex('fghij'.split(''), 2)).toEqual('fgij');
  });
});
