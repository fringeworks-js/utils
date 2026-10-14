import isWithinRange from './isWithinRange';

describe('isWithinRange', () => {
  it('範囲内', () => {
    expect(isWithinRange(5, 0, 10)).toBe(true);
  });

  it('最小値ちょうど（境界を含む）', () => {
    expect(isWithinRange(0, 0, 10)).toBe(true);
  });

  it('最大値ちょうど（境界を含む）', () => {
    expect(isWithinRange(10, 0, 10)).toBe(true);
  });

  it('最小値より小さい', () => {
    expect(isWithinRange(-1, 0, 10)).toBe(false);
  });

  it('最大値より大きい', () => {
    expect(isWithinRange(11, 0, 10)).toBe(false);
  });

  it('小数点の範囲内', () => {
    expect(isWithinRange(0.5, 0, 1)).toBe(true);
  });

  it('負の範囲内', () => {
    expect(isWithinRange(-5, -10, 0)).toBe(true);
  });

  it('min が max より大きい場合は入れ替えて扱う', () => {
    expect(isWithinRange(5, 10, 0)).toBe(true);
    expect(isWithinRange(10, 10, 0)).toBe(true);
    expect(isWithinRange(11, 10, 0)).toBe(false);
  });
});
