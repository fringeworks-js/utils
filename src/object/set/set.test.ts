import set from './set';

describe('set', () => {
  it('トップレベルのプロパティを設定して新しいオブジェクトを返す', () => {
    const obj = { a: 1 };
    const result = set(obj, 'a', 2);
    expect(result.a).toBe(2);
    expect(result).not.toBe(obj);
  });

  it('ネストしたパスにも設定できる', () => {
    const obj = { a: { b: 1 } };
    const result = set(obj, 'a.b', 99);
    expect(result.a.b).toBe(99);
    expect(result.a).not.toBe(obj.a);
  });

  it('パスを配列で指定できる', () => {
    const obj = { a: { b: 1 } };
    const result = set(obj, ['a', 'b'], 42);
    expect(result.a.b).toBe(42);
  });

  it('存在しないネストパスに中間オブジェクトを作成する', () => {
    const obj = {};
    const result = set(obj, 'a.b.c', 1) as any;
    expect(result.a.b.c).toBe(1);
  });

  it('配列のインデックスパスにも設定できる', () => {
    const obj = { arr: [1, 2, 3] };
    const result = set(obj, 'arr.1', 99);
    expect((result as any).arr[1]).toBe(99);
    expect((result as any).arr[0]).toBe(1);
  });

  it('存在しない値は次のキーがインデックスなら配列として作成する', () => {
    expect(set({}, 'a[0]', 'x')).toEqual({ a: ['x'] });
    expect(set({}, ['a', 0], 'x')).toEqual({ a: ['x'] });
  });

  it('ドットの後の数字は文字列のキーとして扱い、オブジェクトを作成する', () => {
    expect(set({}, 'a.0', 'x')).toEqual({ a: { 0: 'x' } });
  });

  it('既存のオブジェクトは数値キーでも配列にしない', () => {
    expect(set({}, [0], 'x')).toEqual({ 0: 'x' });
    expect(set({ a: { x: 1 } }, ['a', 0], 'v')).toEqual({
      a: { x: 1, 0: 'v' },
    });
    expect(set({ users: { 1: 'u1' } }, 'users.2', 'u2')).toEqual({
      users: { 1: 'u1', 2: 'u2' },
    });
  });

  it('既存の値がプリミティブの場合はキーに合わせて作り直す', () => {
    expect(set({ a: 1 }, 'a.b', 2)).toEqual({ a: { b: 2 } });
    expect(set({ a: 1 }, 'a[0]', 2)).toEqual({ a: [2] });
  });

  it('__proto__を含むパスは何もせず元のオブジェクトを返す', () => {
    const obj = { a: 1 };
    expect(set(obj, '__proto__.polluted', 1)).toBe(obj);
    expect(set(obj, ['a', '__proto__'], 1)).toBe(obj);
    expect(({} as any).polluted).toBeUndefined();
  });

  it('readonlyの配列や数値のキーでパスを指定できる', () => {
    const path = ['a', 1] as const;
    expect(set({ a: [10, 20] }, path, 99)).toEqual({ a: [10, 99] });
    expect(set([10, 20], 0, 99)).toEqual([99, 20]);
  });

  it('空のパスは何もせず元のオブジェクトを返す', () => {
    const obj = { a: 1 };
    expect(set(obj, [], 'v')).toBe(obj);
    expect(set(obj, '', 'v')).toBe(obj);
    expect(obj).toEqual({ a: 1 });
  });

  it('プロトタイプ上の値は辿らず、自身のプロパティとして作る', () => {
    const proto = { a: { b: 1 } };
    const obj = Object.create(proto) as { a: { b: number; c?: number } };
    expect(set(obj, 'a.c', 2)).toEqual({ a: { c: 2 } });
    expect(proto).toEqual({ a: { b: 1 } });
  });
});
