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
  it('readonly の配列を渡せる', () => {
    const pairs = [
      ['a', 1],
      ['b', 2],
    ] as const;
    const result = swapPairs(pairs);
    expectTypeOf(result).toEqualTypeOf<[[1, 'a'], [2, 'b']]>();
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('書き換えられる配列の変数を渡せる', () => {
    const pairs: [string, number][] = [['a', 1]];
    const result = swapPairs(pairs);
    expectTypeOf(result).toEqualTypeOf<[number, string][]>();
    expect(result).toEqual([[1, 'a']]);
  });

  it('nullを渡した場合は空配列を返す', () => {
    expect(swapPairs(null)).toEqual([]);
    expect(swapPairs(undefined)).toEqual([]);
  });
});
