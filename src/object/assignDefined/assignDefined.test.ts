import assignDefined from './assignDefined';

describe('assignDefined', () => {
  it('undefinedでない値のみ適用して新しいオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignDefined(target, { a: 10, b: undefined });
    expect(result.a).toBe(10);
    expect(result.b).toBe(2);
    expect(result).not.toBe(target);
  });

  it('非破壊的でtargetは変更されない', () => {
    const target = { a: 1 };
    assignDefined(target, { a: 99 });
    expect(target.a).toBe(1);
  });

  it('skipNull: trueでnullも除外する', () => {
    const result = assignDefined({ a: 1 }, { a: null as any });
    expect(result.a).toBeNull();

    const result2 = assignDefined(
      { a: 1 },
      { a: null as any },
      { skipNull: true },
    );
    expect(result2.a).toBe(1);
  });

  it('targetがfalsyなら入力をそのまま返す', () => {
    const result = assignDefined(null as any, { a: 1 });
    expect(result).toBeNull();
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = assignDefined.dataLast({ a: 10, b: undefined })({
        a: 1,
        b: 2,
      });
      expect(result.a).toBe(10);
      expect(result.b).toBe(2);
    });
  });
});
