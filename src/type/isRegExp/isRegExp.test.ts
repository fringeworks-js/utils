import isRegExp from './isRegExp';

describe('isRegExp', () => {
  it('正規表現リテラルはtrue', () => {
    expect(isRegExp(/pattern/)).toBe(true);
  });

  it('RegExpコンストラクタはtrue', () => {
    expect(isRegExp(new RegExp('pattern'))).toBe(true);
  });

  it('文字列はfalse', () => {
    expect(isRegExp('/pattern/')).toBe(false);
  });

  it('nullはfalse', () => {
    expect(isRegExp(null)).toBe(false);
  });

  it('undefinedはfalse', () => {
    expect(isRegExp(undefined)).toBe(false);
  });

  it('オブジェクトはfalse', () => {
    expect(isRegExp({})).toBe(false);
  });

  it('Symbol.toStringTagで偽装したオブジェクトはfalse', () => {
    expect(isRegExp({ [Symbol.toStringTag]: 'RegExp' })).toBe(false);
  });
});
