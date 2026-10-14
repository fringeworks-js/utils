import toFlatCase from './toFlatCase';

describe('toFlatCase', () => {
  it('スペース区切り → フラットケース', () => {
    expect(toFlatCase('hello world')).toBe('helloworld');
  });

  it('スネークケース → フラットケース', () => {
    expect(toFlatCase('hello_world')).toBe('helloworld');
  });

  it('キャメルケース → フラットケース', () => {
    expect(toFlatCase('helloWorld')).toBe('helloworld');
  });

  it('ケバブケース → フラットケース', () => {
    expect(toFlatCase('hello-world')).toBe('helloworld');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toFlatCase('hello.world')).toBe('helloworld');
  });

  it('略語を含む', () => {
    expect(toFlatCase('XMLParser')).toBe('xmlparser');
  });

  it('空文字', () => {
    expect(toFlatCase('')).toBe('');
  });
});
