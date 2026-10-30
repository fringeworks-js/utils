import assignPresentMutable from './assignPresentMutable';

describe('assignPresentMutable', () => {
  it('null・undefinedでない値のみ対象オブジェクトに適用する(破壊的)', () => {
    const target = { a: 1, b: 2, c: 3 };
    const result = assignPresentMutable(target, {
      a: 10,
      b: undefined,
      c: null,
    });
    expect(target).toEqual({ a: 10, b: 2, c: 3 });
    expect(result).toBe(target);
  });

  it('継承したプロパティは、includeInheritedを指定した場合だけ反映する', () => {
    const values = Object.create({ a: 1 });
    expect(assignPresentMutable({}, values)).toEqual({});
    expect(
      assignPresentMutable({}, values, { includeInherited: true }),
    ).toEqual({ a: 1 });
  });

  it('__proto__キーは反映しない', () => {
    const target: any = {};
    assignPresentMutable(
      target,
      JSON.parse('{"__proto__":{"polluted":1},"a":1}'),
    );
    expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
    expect(target.polluted).toBeUndefined();
    expect(target).toEqual({ a: 1 });
  });

  it('moveToEnd: 代入したキーを末尾に移し、同じオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignPresentMutable(target, { a: 10 }, { moveToEnd: true });
    expect(result).toBe(target);
    expect(Object.keys(target)).toEqual(['b', 'a']);
  });
});
