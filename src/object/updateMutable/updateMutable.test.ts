import updateMutable from './updateMutable';

describe('updateMutable', () => {
  it('変更されたキーのみ破壊的に更新して以前の値を返す', () => {
    const obj = { a: 1, b: 2 };
    const oldValues = updateMutable(obj, { a: 10 });
    expect(obj.a).toBe(10);
    expect(oldValues).toEqual({ a: 1 });
  });

  it('値が同じキーは更新しない', () => {
    const obj = { a: 1, b: 2 };
    const oldValues = updateMutable(obj, { a: 1 });
    expect(oldValues).toEqual({});
  });

  it('継承プロパティは更新対象にならない', () => {
    const obj = { a: 1, b: 2 };
    const parentValues = { a: 99 };
    const childValues = Object.create(parentValues) as Partial<typeof obj>;
    childValues['b'] = 20;
    const oldValues = updateMutable(obj, childValues);
    expect(obj.a).toBe(1);
    expect(obj.b).toBe(20);
    expect(oldValues).toEqual({ b: 2 });
  });

  it('isEqualで比較方法を指定できる', () => {
    const obj = { a: { x: 1 }, b: 2 };
    const a = obj.a;
    const result = updateMutable(
      obj,
      { a: { x: 1 }, b: 3 },
      { isEqual: (v1, v2) => JSON.stringify(v1) === JSON.stringify(v2) },
    );
    expect(obj.a).toBe(a);
    expect(result).toEqual({ b: 2 });
  });

  it('既定ではObject.isで比較する', () => {
    const obj = { a: NaN, b: 0 };
    expect(updateMutable(obj, { a: NaN })).toEqual({});
    expect(updateMutable(obj, { b: -0 })).toEqual({ b: 0 });
  });

  it('symbolのキーも更新し、以前の値を返す', () => {
    const symbol = Symbol('s');
    const obj = { [symbol]: 1 };
    expect(updateMutable(obj, { [symbol]: 2 })).toEqual({ [symbol]: 1 });
    expect(obj[symbol]).toBe(2);
  });
  it('__proto__キーは反映しない', () => {
    const obj: any = { a: 1 };
    const result = updateMutable(
      obj,
      JSON.parse('{"__proto__":{"polluted":1}}'),
    );
    expect(result).toEqual({});
    expect(Object.getPrototypeOf(obj)).toBe(Object.prototype);
    expect(obj.polluted).toBeUndefined();
  });
});
