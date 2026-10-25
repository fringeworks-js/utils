import compactMap from './compactMap';

describe('compactMap', () => {
  it('nullを渡した場合は空配列を返す', () => {
    expect(compactMap(null, (v) => v)).toEqual([]);
  });

  it('undefinedを渡した場合は空配列を返す', () => {
    expect(compactMap(undefined, (v) => v)).toEqual([]);
  });

  it('callbackがundefinedを返す要素を除外する', () => {
    const result = compactMap([1, 2, 3], (v) => (v > 1 ? v * 10 : undefined));
    expect(result).toEqual([20, 30]);
  });

  it('全ての要素がundefinedでない場合は全て含む', () => {
    const result = compactMap([1, 2, 3], (v) => v * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('全ての要素がundefinedの場合は空配列', () => {
    const result = compactMap([1, 2, 3], () => undefined);
    expect(result).toEqual([]);
  });

  it('空配列', () => {
    expect(compactMap([], (v) => v)).toEqual([]);
  });

  describe('exclude: nullish', () => {
    it('nullもundefinedも除外する', () => {
      const result = compactMap([1, null, 2, undefined, 3], (v) => v, {
        exclude: 'nullish',
      });
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('exclude: empty', () => {
    it('null/undefined/空文字を除外する', () => {
      const result = compactMap(['a', null, '', undefined, 'b'], (v) => v, {
        exclude: 'empty',
      });
      expect(result).toEqual(['a', 'b']);
    });
  });

  describe('exclude: falsy', () => {
    it('falsy値を除外する', () => {
      const result = compactMap([1, 0, 2, false, 3, ''], (v) => v, {
        exclude: 'falsy',
      });
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it('readonly の配列を受け付ける', () => {
    const data: readonly number[] = [1, 2, 3];
    const result = compactMap(data, (value) => value * 10);
    expect(result).toEqual([10, 20, 30]);
    expectTypeOf(result).toEqualTypeOf<number[]>();
  });
});
