import upperFirst from './upperFirst';

describe('upperFirst', () => {
  it('先頭小文字', () => {
    const result = upperFirst('abc');
    expect(result).toBe('Abc');
  });
  it('先頭大文字', () => {
    const result = upperFirst('Abc');
    expect(result).toBe('Abc');
  });
  it('1文字', () => {
    const result = upperFirst('a');
    expect(result).toBe('A');
  });
  it('空文字', () => {
    const result = upperFirst('');
    expect(result).toBe('');
  });
  it('null', () => {
    const result = upperFirst(null as any);
    expect(result).toBe(null);
  });
  it('サロゲートペアの文字を1文字として扱う', () => {
    expect(upperFirst('\u{10428}x')).toBe('\u{10400}x');
  });
});
