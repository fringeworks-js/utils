import toTitleCase from './toTitleCase';

describe('toTitleCase', () => {
  it('スペース区切り → タイトルケース', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('スネークケース → タイトルケース', () => {
    expect(toTitleCase('hello_world')).toBe('Hello World');
  });

  it('ケバブケース → タイトルケース', () => {
    expect(toTitleCase('hello-world')).toBe('Hello World');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toTitleCase('hello.world')).toBe('Hello World');
  });

  it('略語を含む', () => {
    expect(toTitleCase('XMLParser')).toBe('XML Parser');
  });

  it('空文字', () => {
    expect(toTitleCase('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(toTitleCase.dataLast()('hello world')).toBe('Hello World');
    });
  });
});
