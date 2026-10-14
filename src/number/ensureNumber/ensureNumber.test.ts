import ensureNumber from './ensureNumber';

describe('ensureNumber', () => {
  it('数値', () => {
    const result = ensureNumber(123);
    expect(result).toBe(123);
  });

  it('null', () => {
    const result = ensureNumber(null);
    expect(result).toBe(0);
  });

  it('undefined', () => {
    const result = ensureNumber(undefined);
    expect(result).toBe(0);
  });

  it('空文字', () => {
    const result = ensureNumber('');
    expect(result).toBe(0);
  });

  it('文字列', () => {
    const result = ensureNumber('ABC');
    expect(result).toBe(0);
  });

  it('数字', () => {
    const result = ensureNumber('123');
    expect(result).toBe(123);
  });

  it('真偽値(false)', () => {
    const result = ensureNumber(false);
    expect(result).toBe(0);
  });

  it('真偽値(true)', () => {
    const result = ensureNumber(true);
    expect(result).toBe(0);
  });

  it('日時', () => {
    const result = ensureNumber(new Date(1999, 0, 2, 3, 40, 56, 789));
    expect(result).toBe(0);
  });

  it('オブジェクト', () => {
    const result = ensureNumber({});
    expect(result).toBe(0);
  });

  it('配列', () => {
    const result = ensureNumber(['a', 'b', 'c']);
    expect(result).toBe(0);
  });

  it('Infinityはそのまま返す', () => {
    expect(ensureNumber(Infinity)).toBe(Infinity);
    expect(ensureNumber('-Infinity')).toBe(-Infinity);
  });

  it('bigintは0', () => {
    expect(ensureNumber(10n)).toBe(0);
  });

  it('NaN', () => {
    expect(ensureNumber(NaN)).toBe(0);
  });
});
