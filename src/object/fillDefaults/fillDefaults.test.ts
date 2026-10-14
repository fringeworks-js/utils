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

  it('symbolのキーにもデフォルト値を設定する', () => {
    const symbol = Symbol('s');
    const result = fillDefaults(
      { [symbol]: undefined as number | undefined },
      {
        [symbol]: 1,
      },
    );
    expect(result[symbol]).toBe(1);
  });
});
