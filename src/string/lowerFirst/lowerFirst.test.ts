import lowerFirst from './lowerFirst';

describe('lowerFirst', () => {
  it('先頭小文字', () => {
    const result = lowerFirst('abc');
    expect(result).toBe('abc');
  });
  it('先頭大文字', () => {
    const result = lowerFirst('Abc');
    expect(result).toBe('abc');
  });
  it('1文字', () => {
    const result = lowerFirst('A');
    expect(result).toBe('a');
  });
  it('空文字', () => {
    const result = lowerFirst('');
    expect(result).toBe('');
  });
  it('サロゲートペアの文字を1文字として扱う', () => {
    expect(lowerFirst('\u{10400}X')).toBe('\u{10428}X');
  });
});
