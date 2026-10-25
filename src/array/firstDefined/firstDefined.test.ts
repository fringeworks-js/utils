import firstDefined from './firstDefined';

describe('firstDefined', () => {
  it('空配列', () => {
    expect(firstDefined([])).toBeUndefined();
  });

  it('全てundefinedの場合', () => {
    expect(firstDefined([undefined, undefined])).toBeUndefined();
  });

  it('最初のundefined以外の値を返す', () => {
    expect(firstDefined([1, 2, 3])).toBe(1);
  });

  it('先頭がundefinedの場合は次の値を返す', () => {
    expect(firstDefined([undefined, 2, 3])).toBe(2);
  });

  it('nullはundefinedではないので返す', () => {
    expect(firstDefined([null, 2, 3])).toBeNull();
  });

  it('0はundefinedではないので返す', () => {
    expect(firstDefined([0, 1, 2])).toBe(0);
  });

  it('空文字はundefinedではないので返す', () => {
    expect(firstDefined(['', 'a'])).toBe('');
  });

  it('falseはundefinedではないので返す', () => {
    expect(firstDefined([false, true])).toBe(false);
  });
  it('nullを渡した場合はundefinedを返す', () => {
    expect(firstDefined(null)).toBeUndefined();
    expect(firstDefined(undefined)).toBeUndefined();
  });

  it('readonly の配列を受け付ける', () => {
    const data: readonly (number | undefined)[] = [undefined, 1];
    expect(firstDefined(data)).toBe(1);
  });
});
