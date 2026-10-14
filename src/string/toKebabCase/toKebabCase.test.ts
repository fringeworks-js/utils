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

  it('英字・数字以外の文字はすべて単語の区切りとして扱う', () => {
    expect(toKebabCase('user/profile:page')).toBe('user-profile-page');
  });

  it('先頭・末尾の区切りは除く', () => {
    expect(toKebabCase('_private_')).toBe('private');
  });

  it('英字の後の数字の前では区切らない', () => {
    expect(toKebabCase('i18n')).toBe('i18n');
    expect(toKebabCase('base64Encode')).toBe('base64-encode');
  });
});
