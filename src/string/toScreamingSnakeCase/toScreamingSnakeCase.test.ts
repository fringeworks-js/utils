import toScreamingSnakeCase from './toScreamingSnakeCase';

describe('toScreamingSnakeCase', () => {
  it('スペース区切り → スクリーミングスネーク', () => {
    expect(toScreamingSnakeCase('hello world')).toBe('HELLO_WORLD');
  });

  it('キャメルケース → スクリーミングスネーク', () => {
    expect(toScreamingSnakeCase('helloWorld')).toBe('HELLO_WORLD');
  });

  it('ケバブケース → スクリーミングスネーク', () => {
    expect(toScreamingSnakeCase('hello-world')).toBe('HELLO_WORLD');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toScreamingSnakeCase('hello.world')).toBe('HELLO_WORLD');
  });

  it('略語を含む', () => {
    expect(toScreamingSnakeCase('XMLParser')).toBe('XML_PARSER');
  });

  it('空文字', () => {
    expect(toScreamingSnakeCase('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(toScreamingSnakeCase.dataLast()('hello world')).toBe(
        'HELLO_WORLD',
      );
    });
  });
});
