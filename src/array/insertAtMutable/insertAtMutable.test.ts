import insertAtMutable from './insertAtMutable';

describe('insertAtMutable', () => {
  it('元の配列を直接変更して返す', () => {
    const array: (number | string)[] = [0, 1, 2, 3, 4];
    const result = insertAtMutable(array, 2, ['a', 'b']);
    expect(result).toBe(array);
    expect(array).toEqual([0, 1, 'a', 'b', 2, 3, 4]);
  });

  it('インデックスは範囲内に収める', () => {
    expect(insertAtMutable([0, 1], -1, ['a'])).toEqual(['a', 0, 1]);
    expect(insertAtMutable([0, 1], 10, ['a'])).toEqual([0, 1, 'a']);
  });

  it('dataがnullの場合はnullを返す', () => {
    expect(insertAtMutable(null as any, 0, ['a'])).toBeNull();
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const array: (number | string)[] = [0, 1, 2];
      expect(insertAtMutable.dataLast(1, ['a'])(array)).toBe(array);
      expect(array).toEqual([0, 'a', 1, 2]);
    });
  });
});
