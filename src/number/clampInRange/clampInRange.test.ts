import clampInRange from './clampInRange';

describe('clampInRange', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(clampInRange(5, 0, 10)).toBe(5);
  });

  it('最小値ちょうど', () => {
    expect(clampInRange(0, 0, 10)).toBe(0);
  });

  it('最大値ちょうど', () => {
    expect(clampInRange(10, 0, 10)).toBe(10);
  });

  it('最小値より小さい場合は最小値を返す', () => {
    expect(clampInRange(-5, 0, 10)).toBe(0);
  });

  it('最大値より大きい場合は最大値を返す', () => {
    expect(clampInRange(15, 0, 10)).toBe(10);
  });

  it('小数点', () => {
    expect(clampInRange(1.5, 0, 1)).toBe(1);
  });

  it('負の範囲', () => {
    expect(clampInRange(-5, -10, 0)).toBe(-5);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(clampInRange.dataLast(0, 10)(5)).toBe(5);
    });
  });
});
