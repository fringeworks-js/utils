import recaseCamel from './recaseCamel';

describe('recaseCamel', () => {
  it('スネークケース → キャメルケース', () => {
    expect(recaseCamel('hello_world')).toBe('helloWorld');
  });

  it('ケバブケース → キャメルケース', () => {
    expect(recaseCamel('hello-world')).toBe('helloWorld');
  });

  it('パスカルケース → キャメルケース', () => {
    expect(recaseCamel('HelloWorld')).toBe('helloWorld');
  });

  it('スペース区切り → キャメルケース', () => {
    expect(recaseCamel('hello world')).toBe('helloWorld');
  });

  it('空文字', () => {
    expect(recaseCamel('')).toBe('');
  });

  it('null', () => {
    expect(recaseCamel(null as any)).toBeNull();
  });

  it('undefined', () => {
    expect(recaseCamel(undefined as any)).toBeUndefined();
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(recaseCamel.dataLast()('hello_world')).toBe('helloWorld');
    });
  });
});
