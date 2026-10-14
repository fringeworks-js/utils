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

  it('toJSONにはJSON.stringifyと同じくキーを渡す', () => {
    const value = { toJSON: (key: string) => `key:${key}` };
    expect(stableStringify({ a: value, b: [value] })).toBe(
      JSON.stringify({ a: value, b: [value] }),
    );
    expect(stableStringify(value)).toBe('"key:"');
  });

  it('ボックス化したプリミティブは中の値にする', () => {
    const value = {
      n: Object(1),
      s: Object('x'),
      b: Object(true),
    };
    expect(stableStringify(value)).toBe('{"b":true,"n":1,"s":"x"}');
  });

  it('循環参照はJSON.stringifyと同じくTypeErrorにする', () => {
    const obj: any = { a: {} };
    obj.a.self = obj;
    expect(() => stableStringify(obj)).toThrow(TypeError);
    const array: any[] = [];
    array.push(array);
    expect(() => stableStringify(array)).toThrow(TypeError);
  });

  it('同じオブジェクトを複数の場所で参照していても循環参照とはしない', () => {
    const shared = { b: 1, a: 2 };
    expect(stableStringify({ x: shared, y: [shared] })).toBe(
      '{"x":{"a":2,"b":1},"y":[{"a":2,"b":1}]}',
    );
  });

  it('__proto__キーは読み飛ばす', () => {
    const data = JSON.parse('{"__proto__":{"a":1},"b":2}');
    expect(stableStringify(data)).toBe('{"b":2}');
  });
});
