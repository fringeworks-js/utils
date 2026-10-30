import assignDefinedMutable from './assignDefinedMutable';

describe('assignDefinedMutable', () => {
  it('undefinedでない値のみ対象オブジェクトに適用する(破壊的)', () => {
    const target = { a: 1, b: 2 };
    const result = assignDefinedMutable(target, { a: 10, b: undefined });
    expect(target.a).toBe(10);
    expect(target.b).toBe(2);
    expect(result).toBe(target);
  });

  it('nullは代入する', () => {
    const target: { a: number | null } = { a: 1 };
    assignDefinedMutable(target, { a: null });
    expect(target.a).toBeNull();
  });

  it('__proto__キーは反映しない', () => {
    const target: any = {};
    assignDefinedMutable(
      target,
      JSON.parse('{"__proto__":{"polluted":1},"a":1}'),
    );
    expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
    expect(target.polluted).toBeUndefined();
    expect(target).toEqual({ a: 1 });
  });

  it('moveToEnd: 代入したキーを末尾に移し、同じオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignDefinedMutable(target, { a: 10 }, { moveToEnd: true });
    expect(result).toBe(target);
    expect(Object.keys(target)).toEqual(['b', 'a']);
    expect(target.a).toBe(10);
  });
});
