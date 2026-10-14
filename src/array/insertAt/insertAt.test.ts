import insertAt from './insertAt';

describe('insertAt', () => {
  describe('1要素', () => {
    it('先頭に追加', () => {
      const result = insertAt([0, 1, 2, 3, 4], 0, ['a']);
      expect(result).toEqual(['a', 0, 1, 2, 3, 4]);
    });

    it('中盤に追加', () => {
      const result = insertAt([0, 1, 2, 3, 4], 2, ['a']);
      expect(result).toEqual([0, 1, 'a', 2, 3, 4]);
    });

    it('末尾に追加', () => {
      const result = insertAt([0, 1, 2, 3, 4], 5, ['a']);
      expect(result).toEqual([0, 1, 2, 3, 4, 'a']);
    });

    it('先頭に追加(index=-1)', () => {
      const result = insertAt([0, 1, 2, 3, 4], -1, ['a']);
      expect(result).toEqual(['a', 0, 1, 2, 3, 4]);
    });

    it('末尾に追加(index=要素数以上)', () => {
      const result = insertAt([0, 1, 2, 3, 4], 10, ['a']);
      expect(result).toEqual([0, 1, 2, 3, 4, 'a']);
    });
  });

  describe('複数要素', () => {
    it('先頭に追加', () => {
      const result = insertAt([0, 1, 2, 3, 4], 0, ['a', 'b', 'c']);
      expect(result).toEqual(['a', 'b', 'c', 0, 1, 2, 3, 4]);
    });

    it('中盤に追加', () => {
      const result = insertAt([0, 1, 2, 3, 4], 2, ['a', 'b', 'c']);
      expect(result).toEqual([0, 1, 'a', 'b', 'c', 2, 3, 4]);
    });

    it('末尾に追加', () => {
      const result = insertAt([0, 1, 2, 3, 4], 5, ['a', 'b', 'c']);
      expect(result).toEqual([0, 1, 2, 3, 4, 'a', 'b', 'c']);
    });

    it('先頭に追加(index=-1)', () => {
      const result = insertAt([0, 1, 2, 3, 4], -1, ['a', 'b', 'c']);
      expect(result).toEqual(['a', 'b', 'c', 0, 1, 2, 3, 4]);
    });

    it('末尾に追加(index=要素数以上)', () => {
      const result = insertAt([0, 1, 2, 3, 4], 10, ['a', 'b', 'c']);
      expect(result).toEqual([0, 1, 2, 3, 4, 'a', 'b', 'c']);
    });
  });

  it('元の配列は変更されない', () => {
    const array: any[] = [0, 1, 2, 3, 4];
    insertAt(array, 2, ['a']);
    expect(array).toEqual([0, 1, 2, 3, 4]);
  });

  it('dataがnullの場合は空配列として扱う', () => {
    expect(insertAt(null, 0, ['a'])).toEqual(['a']);
  });

  it('itemsがnullの場合はコピーを返す', () => {
    const array = [1, 2];
    const result = insertAt(array, 1, null);
    expect(result).toEqual([1, 2]);
    expect(result).not.toBe(array);
  });
});
