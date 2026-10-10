import fillDefaults from './fillDefaults';

describe('fillDefaults', () => {
  it('undefinedのプロパティにデフォルト値を設定して新しいオブジェクトを返す', () => {
    const target = { a: 1, b: undefined };
    const result = fillDefaults(target, { a: 99, b: 2 });
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result).not.toBe(target);
  });

  it('非破壊的でtargetは変更されない', () => {
    const target = { a: undefined };
    fillDefaults(target, { a: 42 });
    expect(target.a).toBeUndefined();
  });

  it('overwriteNull: trueでnullにもデフォルト値を適用する', () => {
    const result = fillDefaults(
      { a: null as any },
      { a: 10 },
      { overwriteNull: true },
    );
    expect(result.a).toBe(10);
  });

  it('targetがfalsyなら入力をそのまま返す', () => {
    const result = fillDefaults(null as any, { a: 1 });
    expect(result).toBeNull();
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = fillDefaults.dataLast({ b: 42 })({ a: 1, b: undefined });
      expect(result.a).toBe(1);
      expect(result.b).toBe(42);
    });
  });
});
