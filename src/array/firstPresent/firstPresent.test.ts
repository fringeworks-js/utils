import firstPresent from './firstPresent';

describe('firstPresent', () => {
  it('空配列', () => {
    expect(firstPresent([])).toBeUndefined();
  });

  it('全てnullishの場合', () => {
    expect(firstPresent([null, undefined, null])).toBeUndefined();
  });

  it('最初のnull/undefined以外の値を返す', () => {
    expect(firstPresent([1, 2, 3])).toBe(1);
  });

  it('先頭がnullの場合は次の値を返す', () => {
    expect(firstPresent([null, 2, 3])).toBe(2);
  });

  it('先頭がundefinedの場合は次の値を返す', () => {
    expect(firstPresent([undefined, 2, 3])).toBe(2);
  });

  it('0はpresentなので返す', () => {
    expect(firstPresent([0, 1, 2])).toBe(0);
  });

  it('空文字はpresentなので返す', () => {
    expect(firstPresent(['', 'a'])).toBe('');
  });

  it('falseはpresentなので返す', () => {
    expect(firstPresent([false, true])).toBe(false);
  });
  it('nullを渡した場合はundefinedを返す', () => {
    expect(firstPresent(null)).toBeUndefined();
    expect(firstPresent(undefined)).toBeUndefined();
  });

  it('readonly の配列を受け付ける', () => {
    const data: readonly (number | null)[] = [null, 1];
    expect(firstPresent(data)).toBe(1);
  });
});
