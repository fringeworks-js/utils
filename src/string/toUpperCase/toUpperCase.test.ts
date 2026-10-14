import toUpperCase from './toUpperCase';

describe('toUpperCase', () => {
  it('小文字 → 大文字', () => {
    expect(toUpperCase('hello world')).toBe('HELLO WORLD');
  });

  it('全て小文字', () => {
    expect(toUpperCase('abc')).toBe('ABC');
  });

  it('大文字はそのまま', () => {
    expect(toUpperCase('ABC')).toBe('ABC');
  });

  it('空文字', () => {
    expect(toUpperCase('')).toBe('');
  });
});
