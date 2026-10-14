import { set } from '../set';
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
    expect(flattenObject({ a: [1, 2] })).toEqual({ 'a[0]': 1, 'a[1]': 2 });
  });

  it('配列の要素は[0]の形、数字のキーを持つオブジェクトは.0の形で連結する', () => {
    expect(flattenObject({ a: [[1], [{ b: 2 }]], c: { 0: 'x' } })).toEqual({
      'a[0][0]': 1,
      'a[1][0].b': 2,
      'c.0': 'x',
    });
  });

  it('トップレベルの配列は[0]の形にする', () => {
    expect(flattenObject([1, { a: 2 }])).toEqual({ '[0]': 1, '[1].a': 2 });
  });

  it('作ったキーをsetに渡すと元の構造に戻せる', () => {
    const data = { a: [1, { b: 2 }], c: { 0: 'x' } };
    let restored: object = {};
    for (const [path, value] of Object.entries(flattenObject(data))) {
      restored = set(restored, path, value);
    }
    expect(restored).toEqual(data);
    expect(Array.isArray((restored as typeof data).a)).toBe(true);
    expect(Array.isArray((restored as typeof data).c)).toBe(false);
  });

  it('空オブジェクト', () => {
    expect(flattenObject({})).toEqual({});
  });

  it('中身の無いオブジェクト・配列は値として残す', () => {
    expect(flattenObject({ a: {}, b: [], c: { d: {} }, e: 1 })).toEqual({
      a: {},
      b: [],
      'c.d': {},
      e: 1,
    });
  });

  it('空文字のキーも親のパスとして連結する', () => {
    expect(flattenObject({ '': { a: 1 } })).toEqual({ '.a': 1 });
  });

  it('連結したキーが重複した場合は後の値で上書きする', () => {
    expect(flattenObject({ 'a.b': 1, a: { b: 2 } })).toEqual({ 'a.b': 2 });
  });

  it('連結したキーが__proto__になる場合は読み飛ばす', () => {
    const result = flattenObject(
      { __: { proto__: { polluted: 1 } }, a: 1 },
      { keySeparator: '' },
    );
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result).toEqual({ __proto__polluted: 1, a: 1 });

    const unsafe: any = flattenObject(
      { __: { proto__: 1 } },
      { keySeparator: '' },
    );
    expect(Object.getPrototypeOf(unsafe)).toBe(Object.prototype);
    expect(unsafe).toEqual({});
  });

  describe('leafKeysOnly', () => {
    it('配列の要素はインデックスをそのままキーにする', () => {
      expect(flattenObject({ a: [1, 2] }, { leafKeysOnly: true })).toEqual({
        0: 1,
        1: 2,
      });
    });
  });

  describe('keySeparator', () => {
    it('配列の要素は区切り文字に関わらず[0]の形で連結する', () => {
      expect(flattenObject({ a: [{ b: 1 }] }, { keySeparator: '_' })).toEqual({
        'a[0]_b': 1,
      });
    });

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
  it('__proto__キーは読み飛ばす', () => {
    const data = JSON.parse('{"x":{"__proto__":[1]},"__proto__":{"a":1}}');
    const result = flattenObject(data, {
      leafKeysOnly: true,
      keepArrays: true,
    });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result).toEqual({});
  });
});
