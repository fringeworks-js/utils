import toArray from './toArray';

describe('toArray', () => {
  it('null', () => {
    expect(toArray(null)).toEqual([]);
  });

  it('undefined', () => {
    expect(toArray(undefined)).toEqual([]);
  });

  it('配列', () => {
    const array = [1, 2, 3];
    const result = toArray(array);
    expect(result).toEqual([1, 2, 3]);
  });

  it('配列はコピーを返す', () => {
    const array = [1, 2, 3];
    const result = toArray(array);
    expect(result).not.toBe(array);
  });

  it('raw: true で配列をそのまま返す', () => {
    const array = [1, 2, 3];
    const result = toArray(array, { raw: true });
    expect(result).toBe(array);
  });

  it('文字列は配列で包む', () => {
    expect(toArray('hello')).toEqual(['hello']);
  });

  it('空文字列は配列で包む', () => {
    expect(toArray('')).toEqual(['']);
  });

  it('数値は配列で包む', () => {
    expect(toArray(42)).toEqual([42]);
  });

  it('オブジェクトは配列で包む', () => {
    const obj = { a: 1 };
    expect(toArray(obj)).toEqual([{ a: 1 }]);
  });

  it('Setは展開する', () => {
    const set = new Set([1, 2, 3]);
    expect(toArray(set)).toEqual([1, 2, 3]);
  });

  it('Mapは展開する', () => {
    const map = new Map([['a', 1]]);
    expect(toArray(map)).toEqual([['a', 1]]);
  });

  it('ジェネレーターは展開する', () => {
    function* gen() {
      yield 1;
      yield 2;
    }
    expect(toArray(gen())).toEqual([1, 2]);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = toArray.dataLast()([1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('null', () => {
      expect(toArray.dataLast()(null)).toEqual([]);
    });
  });
});
