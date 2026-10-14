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
  it('要素数が多い配列も挿入できる', () => {
    const result = insertAtMutable([1, 2], 1, new Array(300000).fill(0));
    expect(result.length).toBe(300002);
    expect(result[0]).toBe(1);
    expect(result[300001]).toBe(2);
  });
});
