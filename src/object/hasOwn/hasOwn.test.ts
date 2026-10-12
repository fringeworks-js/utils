import hasOwn from './hasOwn';

describe('hasOwn', () => {
  it('存在するプロパティはtrue', () => {
    expect(hasOwn({ a: 1 }, 'a')).toBe(true);
  });

  it('存在しないプロパティはfalse', () => {
    expect(hasOwn({ a: 1 }, 'b')).toBe(false);
  });

  it('値がundefinedのプロパティもtrue', () => {
    expect(hasOwn({ a: undefined }, 'a')).toBe(true);
  });

  it('継承されたプロパティはfalse', () => {
    const obj = Object.create({ inherited: true });
    expect(hasOwn(obj, 'inherited')).toBe(false);
  });

  it('Symbolのキーも判定できる', () => {
    const key = Symbol('key');
    expect(hasOwn({ [key]: 1 }, key)).toBe(true);
  });

  it('配列のインデックスも判定できる', () => {
    expect(hasOwn(['a'], 0)).toBe(true);
    expect(hasOwn(['a'], 1)).toBe(false);
  });

  it('プロトタイプがnullのオブジェクトでも判定できる', () => {
    const obj = Object.create(null) as Record<string, unknown>;
    obj['a'] = 1;
    expect(hasOwn(obj, 'a')).toBe(true);
  });

  it('hasOwnPropertyを上書きしたオブジェクトでも判定できる', () => {
    const obj = { a: 1, hasOwnProperty: () => false };
    expect(hasOwn(obj, 'a')).toBe(true);
  });
});
