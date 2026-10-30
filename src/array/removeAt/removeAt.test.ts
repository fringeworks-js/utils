import removeAt from './removeAt';

describe('removeAt', () => {
  it('指定の位置の要素を削除した新しい配列を返す', () => {
    const array = [0, 1, 2, 3, 4];
    const result = removeAt(array, 1, { count: 2 });
    expect(result).toEqual([0, 3, 4]);
    expect(result).not.toBe(array);
    expect(array).toEqual([0, 1, 2, 3, 4]);
  });

  it('範囲外の場合も新しい配列を返す', () => {
    const array = [0, 1, 2];
    const result = removeAt(array, 5);
    expect(result).toEqual([0, 1, 2]);
    expect(result).not.toBe(array);
  });

  it('null・undefinedは空配列として扱う', () => {
    expect(removeAt(null, 0)).toEqual([]);
    expect(removeAt(undefined, 0)).toEqual([]);
  });

  it('readonlyの配列を受け付ける', () => {
    const array = [1, 2, 3] as const;
    const result = removeAt(array, 0);
    expect(result).toEqual([2, 3]);
    expectTypeOf(result).toEqualTypeOf<(1 | 2 | 3)[]>();
  });
});
