import isEqual from './isEqual';

describe('isEqual', () => {
  it('プリミティブ', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, '1')).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  it('オブジェクトの深い比較', () => {
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('配列の深い比較', () => {
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('isEqualWith の既定の比較と同じ基準で比較する', () => {
    class A {
      x = 1;
    }
    class B {
      x = 1;
    }
    expect(isEqual(new A(), new B())).toBe(false);
    expect(isEqual([1], { 0: 1 })).toBe(false);
    expect(isEqual(/a/, /b/)).toBe(false);
    expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(true);
    expect(isEqual(0, -0)).toBe(true);
  });
});
