import toLowerCase from './toLowerCase';

describe('toLowerCase', () => {
  it('大文字 → 小文字', () => {
    expect(toLowerCase('Hello World')).toBe('hello world');
  });

  it('全て大文字', () => {
    expect(toLowerCase('ABC')).toBe('abc');
  });

  it('小文字はそのまま', () => {
    expect(toLowerCase('abc')).toBe('abc');
  });

  it('空文字', () => {
    expect(toLowerCase('')).toBe('');
  });
});
