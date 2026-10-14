import pushAll from './pushAll';

describe('pushAll', () => {
  it('1要素', () => {
    const array: any[] = [0, 1, 2, 3, 4];
    const result = pushAll(array, ['a']);
    expect(result).toEqual([0, 1, 2, 3, 4, 'a']);
  });

  it('複数要素', () => {
    const array: any[] = [0, 1, 2, 3, 4];
    const result = pushAll(array, ['a', 'b', 'c']);
    expect(result).toEqual([0, 1, 2, 3, 4, 'a', 'b', 'c']);
  });

  it('元の配列を変更しない（非破壊的）', () => {
    const array = [1, 2, 3];
    const result = pushAll(array, [4, 5]);
    expect(result).not.toBe(array);
    expect(array).toEqual([1, 2, 3]);
  });

  it('sourceがnullの場合は元の配列のコピーを返す', () => {
    const array = [1, 2, 3];
    const result = pushAll(array, null);
    expect(result).toEqual([1, 2, 3]);
  });

  it('空配列に追加する', () => {
    const result = pushAll([], [1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('dataがnullの場合は空配列として扱う', () => {
    expect(pushAll(null, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('dataもsourceもnullの場合は空配列を返す', () => {
    expect(pushAll(null, null)).toEqual([]);
  });
});
