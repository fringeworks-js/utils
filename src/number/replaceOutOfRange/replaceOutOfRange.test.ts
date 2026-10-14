import replaceOutOfRange from './replaceOutOfRange';

describe('replaceOutOfRange', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(replaceOutOfRange(5, 0, 10, -1)).toBe(5);
  });

  it('最小値ちょうど', () => {
    expect(replaceOutOfRange(0, 0, 10, -1)).toBe(0);
  });

  it('最大値ちょうど', () => {
    expect(replaceOutOfRange(10, 0, 10, -1)).toBe(10);
  });

  it('範囲外の場合はデフォルト値を返す', () => {
    expect(replaceOutOfRange(-1, 0, 10, -1)).toBe(-1);
  });

  it('最大値超過でデフォルト値を返す', () => {
    expect(replaceOutOfRange(11, 0, 10, 99)).toBe(99);
  });

  it('min が max より大きい場合は入れ替えて扱う', () => {
    expect(replaceOutOfRange(5, 10, 0, -1)).toBe(5);
    expect(replaceOutOfRange(15, 10, 0, -1)).toBe(-1);
  });
});
