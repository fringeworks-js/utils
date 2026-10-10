import ensureMap from './ensureMap';

describe('ensureMap', () => {
  it('nullは空のMapを返す', () => {
    const result = ensureMap(null);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('undefinedは空のMapを返す', () => {
    const result = ensureMap(undefined);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('Mapはコピーを返す', () => {
    const original = new Map([['a', 1]]);
    const result = ensureMap(original);
    expect(result).not.toBe(original);
    expect(result.get('a')).toBe(1);
  });

  it('raw: true でMapをそのまま返す', () => {
    const original = new Map([['a', 1]]);
    const result = ensureMap(original, { raw: true });
    expect(result).toBe(original);
  });

  it('タプル配列はMapに変換する', () => {
    const result = ensureMap([
      ['a', 1],
      ['b', 2],
    ] as [string, number][]);
    expect(result.get('a')).toBe(1);
    expect(result.get('b')).toBe(2);
  });

  it('値配列はインデックスをキーにしたMapを返す', () => {
    const result = ensureMap(['x', 'y', 'z']);
    expect(result.get(0)).toBe('x');
    expect(result.get(1)).toBe('y');
    expect(result.get(2)).toBe('z');
  });

  it('オブジェクトはMapに変換する', () => {
    const result = ensureMap({ a: 1, b: 2 });
    expect(result.get('a')).toBe(1);
    expect(result.get('b')).toBe(2);
  });

  it('プリミティブ値は空のMapを返す', () => {
    const result = ensureMap(42 as any);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = ensureMap.dataLast()(new Map([['x', 1]]));
      expect(result.get('x')).toBe(1);
    });
  });
});
