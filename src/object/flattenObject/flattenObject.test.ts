import flattenObject from './flattenObject';

describe('flattenObject', () => {
  it('フラットなオブジェクトはそのまま', () => {
    expect(flattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('ネストされたオブジェクトをフラット化', () => {
    expect(flattenObject({ a: { b: 1 } })).toEqual({ 'a.b': 1 });
  });

  it('深くネストされたオブジェクト', () => {
    expect(flattenObject({ a: { b: { c: 1 } } })).toEqual({ 'a.b.c': 1 });
  });

  it('配列もフラット化される', () => {
    expect(flattenObject({ a: [1, 2] })).toEqual({ 'a.0': 1, 'a.1': 2 });
  });

  it('空オブジェクト', () => {
    expect(flattenObject({})).toEqual({});
  });

  describe('keySeparator', () => {
    it('区切り文字を変更できる', () => {
      expect(flattenObject({ a: { b: 1 } }, { keySeparator: '_' })).toEqual({
        a_b: 1,
      });
    });
  });

  describe('keepArrays', () => {
    it('配列をフラット化しない', () => {
      expect(flattenObject({ a: [1, 2] }, { keepArrays: true })).toEqual({
        a: [1, 2],
      });
    });
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(flattenObject.dataLast()({ a: { b: 1 } })).toEqual({ 'a.b': 1 });
    });
  });
});
