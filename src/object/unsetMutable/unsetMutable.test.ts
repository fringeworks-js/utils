import unsetMutable from './unsetMutable';

describe('unsetMutable', () => {
  it('オブジェクトのキーを破壊的に削除する', () => {
    const obj: Record<string, unknown> = { a: 1, b: 2 };
    const result = unsetMutable(obj, 'a');
    expect(obj['a']).toBeUndefined();
    expect(result).toBe(obj);
  });

  it('ネストしたパスのキーも削除できる', () => {
    const obj = { a: { b: 1, c: 2 } };
    unsetMutable(obj, 'a.b');
    expect(obj.a).toEqual({ c: 2 });
  });

  it('配列の要素をspliceで削除する', () => {
    const obj = { arr: [1, 2, 3] };
    unsetMutable(obj, 'arr.1');
    expect(obj.arr).toEqual([1, 3]);
  });

  it('存在しないパスは何も変えない', () => {
    const obj = { a: 1 };
    unsetMutable(obj, 'b');
    expect(obj).toEqual({ a: 1 });
  });

  it('配列のカスタムプロパティをdeleteで削除する', () => {
    const arr: any[] = [1, 2, 3];
    (arr as any)['foo'] = 'bar';
    unsetMutable({ arr } as any, ['arr', 'foo']);
    expect((arr as any)['foo']).toBeUndefined();
    expect(arr.length).toBe(3);
  });

  it('配列のlengthや正規でないインデックスでは要素を詰めない', () => {
    const obj = { a: ['p', 'q'] };
    unsetMutable(obj, 'a.length');
    unsetMutable(obj, ['a', '1.0']);
    expect(obj.a).toEqual(['p', 'q']);
  });

  it('__proto__を含むパスは何もしない', () => {
    const obj = { a: { b: 1 } };
    expect(unsetMutable(obj, '__proto__.toString')).toBe(obj);
    unsetMutable(obj, ['a', '__proto__']);
    expect(typeof Object.prototype.toString).toBe('function');
    expect(Object.getPrototypeOf(obj.a)).toBe(Object.prototype);
  });

  it('readonlyの配列や数値のキーでパスを指定できる', () => {
    const obj = { a: { b: 1, c: 2 }, d: [10, 20] };
    unsetMutable(obj, ['a', 'b'] as const);
    unsetMutable(obj.d, 0);
    expect(obj).toEqual({ a: { c: 2 }, d: [20] });
  });

  it('プロトタイプ上のオブジェクトは書き換えない', () => {
    const proto = { a: { b: 1 } };
    const obj = Object.create(proto) as { a: { b?: number } };
    unsetMutable(obj, 'a.b');
    expect(proto).toEqual({ a: { b: 1 } });
  });
});
