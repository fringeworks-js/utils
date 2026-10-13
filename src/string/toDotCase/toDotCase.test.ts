import toDotCase from './toDotCase';

describe('toDotCase', () => {
  it('スペース区切り → ドットケース', () => {
    expect(toDotCase('hello world')).toBe('hello.world');
  });

  it('スネークケース → ドットケース', () => {
    expect(toDotCase('hello_world')).toBe('hello.world');
  });

  it('キャメルケース → ドットケース', () => {
    expect(toDotCase('helloWorld')).toBe('hello.world');
  });

  it('ケバブケース → ドットケース', () => {
    expect(toDotCase('hello-world')).toBe('hello.world');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toDotCase('hello.world')).toBe('hello.world');
  });

  it('略語を含む', () => {
    expect(toDotCase('XMLParser')).toBe('xml.parser');
  });

  it('空文字', () => {
    expect(toDotCase('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(toDotCase.dataLast()('hello world')).toBe('hello.world');
    });
  });
});
