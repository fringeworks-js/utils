import recaseScreamingSnake from './recaseScreamingSnake';

describe('recaseScreamingSnake', () => {
  it('スペース区切り → スクリーミングスネーク', () => {
    expect(recaseScreamingSnake('hello world')).toBe('HELLO_WORLD');
  });

  it('キャメルケース → スクリーミングスネーク', () => {
    expect(recaseScreamingSnake('helloWorld')).toBe('HELLO_WORLD');
  });

  it('ケバブケース → スクリーミングスネーク', () => {
    expect(recaseScreamingSnake('hello-world')).toBe('HELLO_WORLD');
  });

  it('空文字', () => {
    expect(recaseScreamingSnake('')).toBe('');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(recaseScreamingSnake.dataLast()('hello world')).toBe(
        'HELLO_WORLD',
      );
    });
  });
});
