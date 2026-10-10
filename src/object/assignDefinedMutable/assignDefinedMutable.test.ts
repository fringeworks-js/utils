import assignDefinedMutable from './assignDefinedMutable';

describe('assignDefinedMutable', () => {
  it('undefinedでない値のみ対象オブジェクトに適用する(破壊的)', () => {
    const target = { a: 1, b: 2 };
    const result = assignDefinedMutable(target, { a: 10, b: undefined });
    expect(target.a).toBe(10);
    expect(target.b).toBe(2);
    expect(result).toBe(target);
  });

  it('skipNull: trueでnullも除外する', () => {
    const target = { a: 1 };
    assignDefinedMutable(target, { a: null as any }, { skipNull: true });
    expect(target.a).toBe(1);
  });

  it('targetがfalsyなら何も変更しない', () => {
    expect(() => assignDefinedMutable(null as any, { a: 1 })).not.toThrow();
  });
});
