import roundToStep from './roundToStep';

describe('roundToStep', () => {
  it('刻み幅1で四捨五入', () => {
    expect(roundToStep(3.7, 1)).toBe(4);
  });

  it('刻み幅0.5で四捨五入', () => {
    expect(roundToStep(3.7, 0.5)).toBe(3.5);
  });

  it('刻み幅10で四捨五入', () => {
    expect(roundToStep(35, 10)).toBe(40);
  });

  it('ちょうど刻み幅の倍数', () => {
    expect(roundToStep(4, 2)).toBe(4);
  });

  it('刻み幅の半分以下は切り捨て', () => {
    expect(roundToStep(3.2, 0.5)).toBe(3);
  });

  it('刻み幅の半分は切り上げ', () => {
    expect(roundToStep(3.25, 0.5)).toBe(3.5);
  });

  it('負の値', () => {
    expect(roundToStep(-3.7, 1)).toBe(-4);
  });

  it('浮動小数点の誤差を含まない', () => {
    expect(roundToStep(0.3, 0.1)).toBe(0.3);
    expect(roundToStep(0.7, 0.1)).toBe(0.7);
    expect(roundToStep(1.23456, 0.01)).toBe(1.23);
    expect(roundToStep(0.00000034, 1e-7)).toBe(0.0000003);
  });

  it('ちょうど中間の負の値は正の方向へ丸める', () => {
    expect(roundToStep(-2.5, 1)).toBe(-2);
  });

  it('stepが0や有限の数でない場合はそのまま返す', () => {
    expect(roundToStep(1.23, 0)).toBe(1.23);
    expect(roundToStep(1.23, NaN)).toBe(1.23);
    expect(roundToStep(1.23, Infinity)).toBe(1.23);
  });
});
