import createSplitByKeys from './createSplitByKeys';

type Options = { gap?: number; gapX?: number };

describe('createSplitByKeys', () => {
  const split = createSplitByKeys<Options>({ gap: true, gapX: true });

  it('指定したキーのプロパティとそれ以外を分ける', () => {
    expect(split({ gap: 8, id: 'a', className: 'b' })).toEqual([
      { gap: 8 },
      { id: 'a', className: 'b' },
    ]);
  });

  it('値がundefinedのキーも、キーの種類で振り分ける', () => {
    const [picked, rest] = split({ gapX: undefined, title: undefined });
    expect(picked).toHaveProperty('gapX', undefined);
    expect(rest).toHaveProperty('title', undefined);
  });

  it('空のオブジェクトなら両方とも空になる', () => {
    expect(split({})).toEqual([{}, {}]);
  });

  it('元のオブジェクトを変更しない', () => {
    const data = { gap: 8, id: 'a' };
    split(data);
    expect(data).toEqual({ gap: 8, id: 'a' });
  });

  it('symbolのキーも対象にする', () => {
    const sym = Symbol('sym');
    const other = Symbol('other');
    const splitSymbol = createSplitByKeys<{ [sym]?: number }>({ [sym]: true });
    expect(splitSymbol({ [sym]: 1, [other]: 2 })).toEqual([
      { [sym]: 1 },
      { [other]: 2 },
    ]);
  });

  it('列挙できないプロパティと継承したプロパティは無視する', () => {
    const data = Object.create({ gapX: 1 }) as Record<string, unknown>;
    Object.defineProperty(data, 'gap', { value: 8, enumerable: false });
    data.id = 'a';
    expect(split(data)).toEqual([{}, { id: 'a' }]);
  });

  it('__proto__は無視する', () => {
    const data = JSON.parse('{"__proto__": {"polluted": true}, "id": "a"}');
    const [picked, rest] = split(data);
    expect(picked).toEqual({});
    expect(rest).toEqual({ id: 'a' });
    expect(Object.getPrototypeOf(rest)).toBe(Object.prototype);
  });

  describe('型', () => {
    type UnionOptions = { direction: 'x'; alignY?: 'top' } | { direction: 'y' };

    it('ユニオンの全てのキーを列挙できる', () => {
      createSplitByKeys<UnionOptions>({ direction: true, alignY: true });
    });

    it('キーが不足していると型エラーになる', () => {
      // @ts-expect-error alignYが無い
      createSplitByKeys<UnionOptions>({ direction: true });
    });

    it('余分なキーがあると型エラーになる', () => {
      createSplitByKeys<UnionOptions>({
        direction: true,
        alignY: true,
        // @ts-expect-error alignXは無い
        alignX: true,
      });
    });

    it('戻り値は、指定した型と、ユニオンの全てのキーを除いた残りのタプル', () => {
      const splitUnion = createSplitByKeys<UnionOptions>({
        direction: true,
        alignY: true,
      });
      const result = splitUnion({ direction: 'y', alignY: 'top', id: 'a' });
      expectTypeOf(result).toEqualTypeOf<[UnionOptions, { id: string }]>();
    });
  });
});
