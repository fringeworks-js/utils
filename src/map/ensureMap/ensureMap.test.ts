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

  it('タプル配列は要素の長さに関わらずMapのコンストラクターと同じに扱う', () => {
    const result = ensureMap([[1, 2], [3, 4, 5] as any]);
    expect([...result]).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('値を2要素の配列として持つ配列もエントリーとして扱う', () => {
    const result = ensureMap(['ab'].entries());
    expect(result.get(0)).toBe('ab');
  });

  it('Setなどの反復可能なオブジェクトはエントリーとして扱う', () => {
    const result = ensureMap(new Set<[string, number]>([['a', 1]]));
    expect(result.get('a')).toBe(1);
  });

  it('エントリーでない要素を持つ反復可能なオブジェクトはTypeError', () => {
    expect(() => ensureMap(new Set([1]) as any)).toThrow(TypeError);
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

  it('文字列は空のMapを返す', () => {
    expect(ensureMap('ab' as any).size).toBe(0);
  });

  it('キーの型は入力から決まる', () => {
    expectTypeOf(ensureMap({ a: 1 })).toEqualTypeOf<Map<string, number>>();
    expectTypeOf(ensureMap([['a', 1]] as [string, number][])).toEqualTypeOf<
      Map<string, number>
    >();
    expectTypeOf(ensureMap(new Map([[1, 'a']]))).toEqualTypeOf<
      Map<number, string>
    >();
    const source = {} as Record<string, number> | [string, number][];
    expectTypeOf(ensureMap(source)).toEqualTypeOf<Map<string, number>>();
  });

  describe('readonly', () => {
    it('ReadonlyMap を受け付け、複製した Map を返す', () => {
      const data: ReadonlyMap<string, number> = new Map([['a', 1]]);
      const result = ensureMap(data);
      expect(result).not.toBe(data);
      expect(result).toEqual(new Map([['a', 1]]));
      expectTypeOf(result).toEqualTypeOf<Map<string, number>>();
    });

    it('raw: true の戻り値は ReadonlyMap', () => {
      const data: ReadonlyMap<string, number> = new Map([['a', 1]]);
      const result = ensureMap(data, { raw: true });
      expect(result).toBe(data);
      expectTypeOf(result).toEqualTypeOf<ReadonlyMap<string, number>>();
    });

    it('プロパティから作る場合は raw: true でも Map を返す', () => {
      expectTypeOf(ensureMap({ a: 1 }, { raw: true })).toEqualTypeOf<
        Map<string, number>
      >();
    });
  });
});
