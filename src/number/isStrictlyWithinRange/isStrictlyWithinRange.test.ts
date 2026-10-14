import isStrictlyWithinRange from './isStrictlyWithinRange';

describe('isStrictlyWithinRange', () => {
  it('範囲内', () => {
    expect(isStrictlyWithinRange(5, 0, 10)).toBe(true);
  });

  it('最小値ちょうど（境界を含まない）', () => {
    expect(isStrictlyWithinRange(0, 0, 10)).toBe(false);
  });

  it('最大値ちょうど（境界を含まない）', () => {
    expect(isStrictlyWithinRange(10, 0, 10)).toBe(false);
  });

  it('最小値より小さい', () => {
    expect(isStrictlyWithinRange(-1, 0, 10)).toBe(false);
  });

  it('最大値より大きい', () => {
    expect(isStrictlyWithinRange(11, 0, 10)).toBe(false);
  });

  it('最小値+εは範囲内', () => {
    expect(isStrictlyWithinRange(0.001, 0, 10)).toBe(true);
  });

  it('min が max より大きい場合は入れ替えて扱う', () => {
    expect(isStrictlyWithinRange(5, 10, 0)).toBe(true);
    expect(isStrictlyWithinRange(10, 10, 0)).toBe(false);
  });
});
