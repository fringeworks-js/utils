import toSentenceCase from './toSentenceCase';

describe('toSentenceCase', () => {
  it('スペース区切り → センテンスケース', () => {
    expect(toSentenceCase('hello world')).toBe('Hello world');
  });

  it('スネークケース → センテンスケース', () => {
    expect(toSentenceCase('hello_world')).toBe('Hello world');
  });

  it('キャメルケース → センテンスケース', () => {
    expect(toSentenceCase('helloWorld')).toBe('Hello world');
  });

  it('ケバブケース → センテンスケース', () => {
    expect(toSentenceCase('hello-world')).toBe('Hello world');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toSentenceCase('hello.world')).toBe('Hello world');
  });

  it('略語を含む', () => {
    expect(toSentenceCase('XMLParser')).toBe('Xml parser');
  });

  it('空文字', () => {
    expect(toSentenceCase('')).toBe('');
  });
});
