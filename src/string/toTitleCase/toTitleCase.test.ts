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

  it('略語は1つの単語として扱う', () => {
    expect(toTitleCase('XMLParser')).toBe('Xml Parser');
  });

  it('空文字', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('すべて大文字の文字列も単語ごとに先頭だけ大文字にする', () => {
    expect(toTitleCase('HELLO_WORLD')).toBe('Hello World');
  });
});
