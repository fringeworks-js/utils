import isNumberLike from './isNumberLike';

describe('isNumberLike', () => {
  it('数値はtrue', () => {
    expect(isNumberLike(42)).toBe(true);
    expect(isNumberLike(0)).toBe(true);
    expect(isNumberLike(-1)).toBe(true);
  });

  it('数値の文字列はtrue', () => {
    expect(isNumberLike('42')).toBe(true);
    expect(isNumberLike('3.14')).toBe(true);
    expect(isNumberLike('-5')).toBe(true);
  });

  it('空文字はfalse', () => {
    expect(isNumberLike('')).toBe(false);
  });

  it('nullはfalse', () => {
    expect(isNumberLike(null)).toBe(false);
  });

  it('undefinedはfalse', () => {
    expect(isNumberLike(undefined)).toBe(false);
  });

  it('trueはfalse', () => {
    expect(isNumberLike(true)).toBe(false);
  });

  it('falseはfalse', () => {
    expect(isNumberLike(false)).toBe(false);
  });

  it('数値でない文字列はfalse', () => {
    expect(isNumberLike('hello')).toBe(false);
    expect(isNumberLike('123abc')).toBe(false);
  });

  it('NaN文字列はfalse', () => {
    expect(isNumberLike('NaN')).toBe(false);
  });

  it('NaN数値はfalse', () => {
    expect(isNumberLike(NaN)).toBe(false);
  });

  it('符号付き・小数点で始まる・終わる文字列はtrue', () => {
    expect(isNumberLike('+5')).toBe(true);
    expect(isNumberLike('.5')).toBe(true);
    expect(isNumberLike('5.')).toBe(true);
  });

  it('空白を含む文字列はfalse', () => {
    expect(isNumberLike(' ')).toBe(false);
    expect(isNumberLike(' 1')).toBe(false);
    expect(isNumberLike('1 ')).toBe(false);
  });

  it('10進数以外の表記はfalse', () => {
    expect(isNumberLike('0x10')).toBe(false);
    expect(isNumberLike('1e3')).toBe(false);
    expect(isNumberLike('Infinity')).toBe(false);
    expect(isNumberLike('.')).toBe(false);
    expect(isNumberLike('-')).toBe(false);
  });

  it('Infinityはfalse', () => {
    expect(isNumberLike(Infinity)).toBe(false);
  });

  it('数値・文字列以外はfalse', () => {
    expect(isNumberLike([])).toBe(false);
    expect(isNumberLike([5])).toBe(false);
    expect(isNumberLike(10n)).toBe(false);
  });
});
