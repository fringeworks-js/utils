import toTrainCase from './toTrainCase';

describe('toTrainCase', () => {
  it('スペース区切り → トレインケース', () => {
    expect(toTrainCase('hello world')).toBe('Hello-World');
  });

  it('スネークケース → トレインケース', () => {
    expect(toTrainCase('hello_world')).toBe('Hello-World');
  });

  it('キャメルケース → トレインケース', () => {
    expect(toTrainCase('helloWorld')).toBe('Hello-World');
  });

  it('ケバブケース → トレインケース', () => {
    expect(toTrainCase('hello-world')).toBe('Hello-World');
  });

  it('ドット区切りも単語の区切りとして扱う', () => {
    expect(toTrainCase('hello.world')).toBe('Hello-World');
  });

  it('略語を含む', () => {
    expect(toTrainCase('XMLParser')).toBe('Xml-Parser');
  });

  it('空文字', () => {
    expect(toTrainCase('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(toTrainCase.dataLast()('hello world')).toBe('Hello-World');
    });
  });
});
