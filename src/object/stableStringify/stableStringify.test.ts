import stableStringify from './stableStringify';

describe('stableStringify', () => {
  it('プレーンな値', () => {
    expect(stableStringify(42)).toBe('42');
    expect(stableStringify('hello')).toBe('"hello"');
    expect(stableStringify(null)).toBe('null');
  });

  it('キーをアルファベット順にソートする', () => {
    const obj = { z: 1, a: 2, m: 3 };
    expect(stableStringify(obj)).toBe('{"a":2,"m":3,"z":1}');
  });

  it('逆順のキーも正しくソートする', () => {
    expect(stableStringify({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
    expect(stableStringify({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
  });

  it('ネストしたオブジェクトも再帰的にソートする', () => {
    const obj = { z: { y: 1, x: 2 }, a: 3 };
    expect(stableStringify(obj)).toBe('{"a":3,"z":{"x":2,"y":1}}');
  });

  it('配列内のオブジェクトもソートする', () => {
    const obj = [{ z: 1, a: 2 }];
    expect(stableStringify(obj)).toBe('[{"a":2,"z":1}]');
  });

  it('インデント付き', () => {
    const result = stableStringify({ b: 2, a: 1 }, 2);
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('空オブジェクト', () => {
    expect(stableStringify({})).toBe('{}');
  });

  it('空配列', () => {
    expect(stableStringify([])).toBe('[]');
  });

  it('toJSONを持つ値はtoJSONの結果を使う', () => {
    const date = new Date(0);
    expect(stableStringify({ b: date, a: 1 })).toBe(
      `{"a":1,"b":"${date.toJSON()}"}`,
    );
  });
});
