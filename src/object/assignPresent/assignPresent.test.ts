import assignPresent from './assignPresent';

describe('assignPresent', () => {
  it('null・undefinedでない値のみ適用して新しいオブジェクトを返す', () => {
    const target = { a: 1, b: 2, c: 3 };
    const result = assignPresent(target, { a: 10, b: undefined, c: null });
    expect(result).toEqual({ a: 10, b: 2, c: 3 });
    expect(result).not.toBe(target);
  });

  it('非破壊的でtargetは変更されない', () => {
    const target = { a: 1 };
    assignPresent(target, { a: 99 });
    expect(target.a).toBe(1);
  });

  it('symbolのキーも反映する', () => {
    const symbol = Symbol('s');
    const result = assignPresent({ a: 1 }, { [symbol]: 2 });
    expect(result[symbol]).toBe(2);
  });

  it('型: null・undefinedになりうるキーはtargetの型を残す', () => {
    const values = {} as { a: number | null; b: number | undefined; c: number };
    const result = assignPresent({ a: 'x', b: 'y', c: 'z' }, values);
    expectTypeOf(result.a).toEqualTypeOf<number | string>();
    expectTypeOf(result.b).toEqualTypeOf<number | string>();
    expectTypeOf(result.c).toEqualTypeOf<number>();
  });

  it('型: targetに無いキーは、反映されない場合にundefinedになる', () => {
    const values = {} as { d: number | null };
    const result = assignPresent({ a: 1 }, values);
    expectTypeOf(result.d).toEqualTypeOf<number | undefined>();
  });

  it('moveToEnd: 代入したキーだけを末尾に移す（null は代入しないので動かない）', () => {
    const result = assignPresent(
      { a: 1, b: 2, c: 3 },
      { a: 10, b: null },
      { moveToEnd: true },
    );
    expect(result).toEqual({ a: 10, b: 2, c: 3 });
    expect(Object.keys(result)).toEqual(['b', 'c', 'a']);
  });
});
