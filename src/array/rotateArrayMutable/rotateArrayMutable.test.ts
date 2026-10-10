import rotateArrayMutable from './rotateArrayMutable';

describe('rotateArrayMutable', () => {
  it('元の配列を直接変更して返す', () => {
    const array = [0, 1, 2, 3, 4];
    const result = rotateArrayMutable(array, { count: 2 });
    expect(result).toBe(array);
    expect(array).toEqual([2, 3, 4, 0, 1]);
  });

  it('負の数は右シフト', () => {
    const array = [0, 1, 2, 3, 4];
    rotateArrayMutable(array, { count: -1 });
    expect(array).toEqual([4, 0, 1, 2, 3]);
  });

  it('count: 0のとき元の配列をそのまま返す', () => {
    const array = [0, 1, 2, 3, 4];
    expect(rotateArrayMutable(array, { count: 0 })).toBe(array);
    expect(array).toEqual([0, 1, 2, 3, 4]);
  });

  it('空配列はそのまま返す', () => {
    const array: number[] = [];
    expect(rotateArrayMutable(array)).toBe(array);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const array = [0, 1, 2];
      expect(rotateArrayMutable.dataLast()(array)).toBe(array);
      expect(array).toEqual([1, 2, 0]);
    });
  });
});
