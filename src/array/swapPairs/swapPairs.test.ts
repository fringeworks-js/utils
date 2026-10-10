import swapPairs from './swapPairs';

describe('swapPairs', () => {
  it('空配列', () => {
    expect(swapPairs([])).toEqual([]);
  });

  it('1つのペア', () => {
    expect(swapPairs([['a', 1]])).toEqual([[1, 'a']]);
  });

  it('複数のペア', () => {
    expect(
      swapPairs([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]),
    ).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('同じ型のペア', () => {
    expect(
      swapPairs([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [2, 1],
      [4, 3],
    ]);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(swapPairs.dataLast()([['a', 1]])).toEqual([[1, 'a']]);
    });
  });
});
