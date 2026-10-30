import truncateArrayMutable from './truncateArrayMutable';

describe('truncateArrayMutable', () => {
  it('指定の長さまで切り詰めて同じ配列を返す', () => {
    const array = [0, 1, 2, 3, 4];
    const result = truncateArrayMutable(array, 2);
    expect(result).toBe(array);
    expect(array).toEqual([0, 1]);
  });

  it('0で空にする', () => {
    const array = [0, 1, 2];
    truncateArrayMutable(array, 0);
    expect(array).toEqual([]);
  });

  it('配列の長さと同じなら何もしない', () => {
    const array = [0, 1, 2];
    truncateArrayMutable(array, 3);
    expect(array).toEqual([0, 1, 2]);
  });

  it('配列より長い場合は伸ばさない', () => {
    const array = [0, 1, 2];
    truncateArrayMutable(array, 5);
    expect(array).toEqual([0, 1, 2]);
    expect(array.length).toBe(3);
  });

  it('Infinityは何もしない', () => {
    const array = [0, 1, 2];
    truncateArrayMutable(array, Infinity);
    expect(array).toEqual([0, 1, 2]);
  });

  it('小数は切り捨てる', () => {
    const array = [0, 1, 2, 3];
    truncateArrayMutable(array, 2.9);
    expect(array).toEqual([0, 1]);
  });

  it('負の数は0として扱う', () => {
    const array = [0, 1, 2];
    truncateArrayMutable(array, -1);
    expect(array).toEqual([]);
  });

  it('NaNは何もしない', () => {
    const array = [0, 1, 2];
    truncateArrayMutable(array, NaN);
    expect(array).toEqual([0, 1, 2]);
  });
});
