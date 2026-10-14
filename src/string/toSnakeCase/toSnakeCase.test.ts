import toSnakeCase from './toSnakeCase';

describe('toSnakeCase', () => {
  it('キャメルケース → スネークケース', () => {
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
  });

  it('ケバブケース → スネークケース', () => {
    expect(toSnakeCase('hello-world')).toBe('hello_world');
  });

  it('パスカルケース → スネークケース', () => {
    expect(toSnakeCase('HelloWorld')).toBe('hello_world');
  });

  it('スペース区切り → スネークケース', () => {
    expect(toSnakeCase('hello world')).toBe('hello_world');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toSnakeCase('hello.world')).toBe('hello_world');
  });

  it('略語を含む', () => {
    expect(toSnakeCase('XMLParser')).toBe('xml_parser');
  });

  it('空文字', () => {
    expect(toSnakeCase('')).toBe('');
  });
});
