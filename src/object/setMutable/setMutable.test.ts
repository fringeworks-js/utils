import setMutable from './setMutable';

describe('setMutable', () => {
  it('トップレベルのプロパティを設定する', () => {
    const obj = { a: 1 };
    setMutable(obj, 'a', 2);
    expect(obj.a).toBe(2);
  });

  it('ネストしたプロパティをパスで設定する', () => {
    const obj = { a: { b: 1 } };
    setMutable(obj, 'a.b', 42);
    expect(obj.a.b).toBe(42);
  });

  it('パスを配列で指定する', () => {
    const obj: any = { a: {} };
    setMutable(obj, ['a', 'b'], 99);
    expect(obj.a.b).toBe(99);
  });

  it('存在しないネストパスに中間オブジェクトを作成する', () => {
    const obj: any = {};
    setMutable(obj, 'a.b.c', 1);
    expect(obj.a.b.c).toBe(1);
  });

  it('同じオブジェクト参照を返す', () => {
    const obj = { a: 1 };
    const result = setMutable(obj, 'a', 2);
    expect(result).toBe(obj);
  });

  it('__proto__を含むパスは何もしない', () => {
    const obj: any = { a: {} };
    expect(setMutable(obj, '__proto__.polluted', 1)).toBe(obj);
    setMutable(obj, ['a', '__proto__'], { polluted: 1 });
    expect(({} as any).polluted).toBeUndefined();
    expect(obj.a.polluted).toBeUndefined();
    expect(obj).toEqual({ a: {} });
  });

  it('readonlyの配列や数値のキーでパスを指定できる', () => {
    const obj = { a: [10, 20] };
    setMutable(obj, ['a', 1] as const, 99);
    setMutable(obj.a, 0, 98);
    expect(obj).toEqual({ a: [98, 99] });
  });

  it('空のパスは何もせず元のオブジェクトを返す', () => {
    const obj = { a: 1 };
    expect(setMutable(obj, [], 'v')).toBe(obj);
    expect(setMutable(obj, '', 'v')).toBe(obj);
    expect(obj).toEqual({ a: 1 });
  });

  it('プロトタイプ上のオブジェクトは書き換えない', () => {
    const proto = { a: { b: 1 } };
    const obj = Object.create(proto) as { a: { b: number; c?: number } };
    setMutable(obj, 'a.c', 2);
    expect(Object.hasOwnProperty.call(obj, 'a')).toBe(true);
    expect(obj.a).toEqual({ c: 2 });
    expect(proto).toEqual({ a: { b: 1 } });
  });
});
