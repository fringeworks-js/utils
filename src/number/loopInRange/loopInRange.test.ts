import loopInRange from './loopInRange';

describe('loopInRange', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(loopInRange(5, 0, 10)).toBe(5);
  });

  it('最小値ちょうど', () => {
    expect(loopInRange(0, 0, 10)).toBe(0);
  });

  it('最大値ちょうどは最小値になる', () => {
    expect(loopInRange(10, 0, 10)).toBe(0);
    expect(loopInRange(360, 0, 360)).toBe(0);
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

  it('min が max より大きい場合は入れ替えて扱う', () => {
    expect(loopInRange(5, 10, 0)).toBe(5);
    expect(loopInRange(12, 10, 0)).toBe(2);
    expect(loopInRange(-1, 10, 0)).toBe(9);
  });

  it('添字として使える', () => {
    expect([8, 9, 10, 11].map((i) => loopInRange(i, 0, 10))).toEqual([
      8, 9, 0, 1,
    ]);
  });
});
