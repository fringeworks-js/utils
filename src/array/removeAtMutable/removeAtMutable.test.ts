import removeAtMutable from './removeAtMutable';

describe('removeAtMutable', () => {
  it('指定の位置の要素を1つ削除して同じ配列を返す', () => {
    const array = [0, 1, 2, 3, 4];
    const result = removeAtMutable(array, 2);
    expect(result).toBe(array);
    expect(array).toEqual([0, 1, 3, 4]);
  });

  it('先頭・末尾', () => {
    expect(removeAtMutable([0, 1, 2], 0)).toEqual([1, 2]);
    expect(removeAtMutable([0, 1, 2], 2)).toEqual([0, 1]);
  });

  describe('index', () => {
    it('負の数は何も削除しない（後ろから数えない）', () => {
      expect(removeAtMutable([0, 1, 2], -1)).toEqual([0, 1, 2]);
      expect(removeAtMutable([0, 1, 2], -0.5)).toEqual([0, 1, 2]);
    });

    it('配列の長さ以上は何も削除しない', () => {
      expect(removeAtMutable([0, 1, 2], 3)).toEqual([0, 1, 2]);
      expect(removeAtMutable([0, 1, 2], Infinity)).toEqual([0, 1, 2]);
    });

    it('NaNは何も削除しない', () => {
      expect(removeAtMutable([0, 1, 2], NaN)).toEqual([0, 1, 2]);
    });

    it('小数は切り捨てる', () => {
      expect(removeAtMutable([0, 1, 2], 1.9)).toEqual([0, 2]);
      expect(removeAtMutable([0, 1, 2], 2.5)).toEqual([0, 1]);
    });

    it('空配列', () => {
      expect(removeAtMutable([], 0)).toEqual([]);
    });
  });

  describe('count', () => {
    it('指定の数だけ削除する', () => {
      expect(removeAtMutable([0, 1, 2, 3, 4], 1, { count: 3 })).toEqual([0, 4]);
    });

    it('末尾を超える分は無視する', () => {
      expect(removeAtMutable([0, 1, 2, 3], 2, { count: 10 })).toEqual([0, 1]);
      expect(removeAtMutable([0, 1, 2, 3], 1, { count: Infinity })).toEqual([
        0,
      ]);
    });

    it('0以下・NaNは何も削除しない', () => {
      expect(removeAtMutable([0, 1, 2], 1, { count: 0 })).toEqual([0, 1, 2]);
      expect(removeAtMutable([0, 1, 2], 1, { count: -1 })).toEqual([0, 1, 2]);
      expect(removeAtMutable([0, 1, 2], 1, { count: 0.5 })).toEqual([0, 1, 2]);
      expect(removeAtMutable([0, 1, 2], 1, { count: NaN })).toEqual([0, 1, 2]);
    });

    it('小数は切り捨てる', () => {
      expect(removeAtMutable([0, 1, 2, 3], 0, { count: 2.9 })).toEqual([2, 3]);
    });

    it('undefinedは指定しなかったものとして扱う', () => {
      expect(removeAtMutable([0, 1, 2], 0, { count: undefined })).toEqual([
        1, 2,
      ]);
    });
  });
});
