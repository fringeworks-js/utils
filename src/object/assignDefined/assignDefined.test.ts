import assignDefined from './assignDefined';

describe('assignDefined', () => {
  it('undefinedでない値のみ適用して新しいオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignDefined(target, { a: 10, b: undefined });
    expect(result.a).toBe(10);
    expect(result.b).toBe(2);
    expect(result).not.toBe(target);
  });

  it('interfaceで定義した型のオブジェクトを渡せる', () => {
    interface Options {
      size: number;
      color?: string;
    }
    const options: Options = { size: 1 };
    const values: Partial<Options> = { color: 'red', size: undefined };
    expect(assignDefined(options, values)).toEqual({ size: 1, color: 'red' });
  });

  it('非破壊的でtargetは変更されない', () => {
    const target = { a: 1 };
    assignDefined(target, { a: 99 });
    expect(target.a).toBe(1);
  });

  it('nullは代入する', () => {
    const result = assignDefined({ a: 1 as number | null }, { a: null });
    expect(result.a).toBeNull();
  });

  it('型: undefinedになりうるキーだけtargetの型を残す', () => {
    const values = {} as { a: number | null; b: number | undefined };
    const result = assignDefined({ a: 'x', b: 'y' }, values);
    expectTypeOf(result.a).toEqualTypeOf<number | null>();
    expectTypeOf(result.b).toEqualTypeOf<number | string>();
  });

  it('symbolのキーも反映する', () => {
    const symbol = Symbol('s');
    const result = assignDefined({ a: 1 }, { [symbol]: 2 });
    expect(result[symbol]).toBe(2);
  });
});
