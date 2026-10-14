import pingpongInRange from './pingpongInRange';

describe('pingpongInRange', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(pingpongInRange(5, 0, 10)).toBe(5);
  });

  it('最小値ちょうど', () => {
    expect(pingpongInRange(0, 0, 10)).toBe(0);
  });

  it('最大値ちょうど', () => {
    expect(pingpongInRange(10, 0, 10)).toBe(10);
  });

  it('最大値+1は最大値-1に折り返す', () => {
    expect(pingpongInRange(11, 0, 10)).toBe(9);
  });

  it('最大値+10は最小値に折り返す', () => {
    expect(pingpongInRange(20, 0, 10)).toBe(0);
  });

  it('最小値-1は最小値+1に折り返す', () => {
    expect(pingpongInRange(-1, 0, 10)).toBe(1);
  });

  it('rangeが0の場合は最小値を返す', () => {
    expect(pingpongInRange(5, 3, 3)).toBe(3);
  });

  it('min が max より大きい場合は入れ替えて扱う', () => {
    expect(pingpongInRange(5, 10, 0)).toBe(5);
    expect(pingpongInRange(12, 10, 0)).toBe(8);
    expect(pingpongInRange(-2, 10, 0)).toBe(2);
  });
});
