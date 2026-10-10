import lerpNumber from './lerpNumber';

describe('lerpNumber', () => {
  it('ratio=0 のとき baseValue を返す', () => {
    expect(lerpNumber(100, 0)).toBe(0);
  });

  it('ratio=1 のとき value を返す', () => {
    expect(lerpNumber(100, 1)).toBe(100);
  });

  it('ratio=0.5 のとき中間値を返す', () => {
    expect(lerpNumber(100, 0.5)).toBe(50);
  });

  it('ratio=0.25', () => {
    expect(lerpNumber(100, 0.25)).toBe(25);
  });

  it('baseValueを指定した場合', () => {
    expect(lerpNumber(100, 0.5, { baseValue: 50 })).toBe(75);
  });

  it('baseValue=0の場合', () => {
    expect(lerpNumber(100, 0, { baseValue: 0 })).toBe(0);
  });

  it('負の値の補間', () => {
    expect(lerpNumber(-100, 0.5)).toBe(-50);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(lerpNumber.dataLast(0.5)(100)).toBe(50);
    });
  });
});
