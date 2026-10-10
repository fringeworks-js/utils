import isIterable from './isIterable';

describe('isIterable', () => {
  it('配列はtrue', () => {
    expect(isIterable([1, 2, 3])).toBe(true);
  });

  it('文字列はtrue', () => {
    expect(isIterable('hello')).toBe(true);
  });

  it('Setはtrue', () => {
    expect(isIterable(new Set())).toBe(true);
  });

  it('Mapはtrue', () => {
    expect(isIterable(new Map())).toBe(true);
  });

  it('nullはfalse', () => {
    expect(isIterable(null)).toBe(false);
  });

  it('undefinedはfalse', () => {
    expect(isIterable(undefined)).toBe(false);
  });

  it('数値はfalse', () => {
    expect(isIterable(42)).toBe(false);
  });

  it('プレーンオブジェクトはfalse', () => {
    expect(isIterable({})).toBe(false);
  });

  it('カスタムイテレーターを持つオブジェクトはtrue', () => {
    const obj = {
      [Symbol.iterator]: () => ({
        next: () => ({ done: true, value: undefined }),
      }),
    };
    expect(isIterable(obj)).toBe(true);
  });
});
