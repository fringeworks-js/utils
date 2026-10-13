import toPascalCase from './toPascalCase';

describe('toPascalCase', () => {
  it('スネークケース → パスカルケース', () => {
    expect(toPascalCase('hello_world')).toBe('HelloWorld');
  });

  it('ケバブケース → パスカルケース', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
  });

  it('キャメルケース → パスカルケース', () => {
    expect(toPascalCase('helloWorld')).toBe('HelloWorld');
  });

  it('スペース区切り → パスカルケース', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toPascalCase('hello.world')).toBe('HelloWorld');
  });

  it('略語を含む', () => {
    expect(toPascalCase('XMLParser')).toBe('XmlParser');
  });

  it('空文字', () => {
    expect(toPascalCase('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(toPascalCase.dataLast()('hello_world')).toBe('HelloWorld');
    });
  });
});
