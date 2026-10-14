import ensureString from './ensureString';

describe('ensureString', () => {
  it('文字列', () => {
    const result = ensureString('Abc');
    expect(result).toBe('Abc');
  });

  it('null', () => {
    const result = ensureString(null);
    expect(result).toBe('');
  });

  it('undefined', () => {
    const result = ensureString(undefined);
    expect(result).toBe('');
  });

  it('空文字', () => {
    const result = ensureString('');
    expect(result).toBe('');
  });

  it('数値', () => {
    const result = ensureString(123);
    expect(result).toBe('123');
  });

  it('真偽値', () => {
    const result = ensureString(true);
    expect(result).toBe('true');
  });

  it('日時', () => {
    const result = ensureString(new Date(1999, 0, 2, 3, 40, 56, 789));
    expect(result).toBe('Sat Jan 02 1999 03:40:56 GMT+0900 (日本標準時)');
  });

  it('オブジェクト', () => {
    const result = ensureString({});
    expect(result).toBe('[object Object]');
  });

  it('配列', () => {
    const result = ensureString(['a', 'b', 'c']);
    expect(result).toBe('a,b,c');
  });

  it('シンボル', () => {
    expect(ensureString(Symbol('a'))).toBe('Symbol(a)');
  });

  it('プロトタイプの無いオブジェクトは普通のオブジェクトと同じ文字列にする', () => {
    expect(ensureString(Object.create(null))).toBe('[object Object]');
  });

  it('toStringが例外を投げるオブジェクトも文字列にする', () => {
    const value = {
      toString() {
        throw new Error('error');
      },
    };
    expect(ensureString(value)).toBe('[object Object]');
  });
});
