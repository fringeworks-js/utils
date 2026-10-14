import toCamelCase from './toCamelCase';

describe('toCamelCase', () => {
  it('スネークケース → キャメルケース', () => {
    expect(toCamelCase('hello_world')).toBe('helloWorld');
  });

  it('ケバブケース → キャメルケース', () => {
    expect(toCamelCase('hello-world')).toBe('helloWorld');
  });

  it('パスカルケース → キャメルケース', () => {
    expect(toCamelCase('HelloWorld')).toBe('helloWorld');
  });

  it('スペース区切り → キャメルケース', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toCamelCase('hello.world')).toBe('helloWorld');
  });

  it('略語を含む', () => {
    expect(toCamelCase('XMLParser')).toBe('xmlParser');
  });

  it('空文字', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('null', () => {
    expect(toCamelCase(null as any)).toBeNull();
  });

  it('undefined', () => {
    expect(toCamelCase(undefined as any)).toBeUndefined();
  });

  it('英字・数字以外の文字はすべて単語の区切りとして扱う', () => {
    expect(toCamelCase('--main-color')).toBe('mainColor');
    expect(toCamelCase('user:first name')).toBe('userFirstName');
  });

  it('数字を含む', () => {
    expect(toCamelCase('version 2 beta')).toBe('version2Beta');
    expect(toCamelCase('HTML5_PARSER')).toBe('html5Parser');
  });
});
