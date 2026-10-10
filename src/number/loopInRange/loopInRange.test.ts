import loopInRange from './loopInRange';

describe('loopInRange', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(loopInRange(5, 0, 10)).toBe(5);
  });

  it('最小値ちょうど', () => {
    expect(loopInRange(0, 0, 10)).toBe(0);
  });

  it('最大値ちょうど', () => {
    expect(loopInRange(10, 0, 10)).toBe(10);
  });

  it('最大値を超えるとループする', () => {
    expect(loopInRange(11, 0, 10)).toBe(1);
  });

  it('最大値の2倍-1はmax-1に戻る', () => {
    expect(loopInRange(19, 0, 10)).toBe(9);
  });

  it('最小値より小さい場合は後ろからループする', () => {
    expect(loopInRange(-1, 0, 10)).toBe(9);
  });

  it('rangeが0の場合は最小値を返す', () => {
    expect(loopInRange(5, 3, 3)).toBe(3);
  });

  it('範囲が1から始まる場合（range=2, rem=3%2=1, result=1+1=2）', () => {
    expect(loopInRange(4, 1, 3)).toBe(2);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(loopInRange.dataLast(0, 10)(5)).toBe(5);
    });
  });
});
