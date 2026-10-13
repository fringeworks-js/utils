import toKebabCase from './toKebabCase';

describe('toKebabCase', () => {
  it('スネークケース → ケバブケース', () => {
    expect(toKebabCase('hello_world')).toBe('hello-world');
  });

  it('キャメルケース → ケバブケース', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
  });

  it('パスカルケース → ケバブケース', () => {
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  it('スペース区切り → ケバブケース', () => {
    expect(toKebabCase('hello world')).toBe('hello-world');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toKebabCase('hello.world')).toBe('hello-world');
  });

  it('略語を含む', () => {
    expect(toKebabCase('XMLParser')).toBe('xml-parser');
  });

  it('空文字', () => {
    expect(toKebabCase('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(toKebabCase.dataLast()('hello_world')).toBe('hello-world');
    });
  });
});
