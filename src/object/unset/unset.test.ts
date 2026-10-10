import unset from './unset';

describe('unset', () => {
  it('オブジェクトのキーを削除した新しいオブジェクトを返す', () => {
    const obj = { a: 1, b: 2 };
    const result = unset(obj, 'a');
    expect(result).toEqual({ b: 2 });
    expect(result).not.toBe(obj);
    expect(obj.a).toBe(1);
  });

  it('ネストしたパスのキーも削除できる', () => {
    const obj = { a: { b: 1, c: 2 } };
    const result = unset(obj, 'a.b');
    expect((result as any).a).toEqual({ c: 2 });
    expect((result as any).a).not.toBe(obj.a);
  });

  it('配列の要素を削除できる(splice)', () => {
    const obj = { arr: [1, 2, 3] };
    const result = unset(obj, 'arr.1');
    expect((result as any).arr).toEqual([1, 3]);
  });

  it('存在しないパスは何も変えない', () => {
    const obj = { a: 1 };
    const result = unset(obj, 'b');
    expect(result).toEqual({ a: 1 });
  });

  it('ネストしたパスで子が存在しない場合は同じ参照を返す', () => {
    const obj = { a: { b: 1 } };
    const result = unset(obj, 'a.x') as any;
    expect(result.a).toEqual({ b: 1 });
    expect(result.a).toBe(obj.a);
  });

  it('ネストした配列内の要素を削除できる', () => {
    const obj = {
      arr: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    };
    const result = unset(obj, 'arr.0.1') as any;
    expect(result.arr[0]).toEqual([1, 3]);
    expect(result.arr[1]).toEqual([4, 5, 6]);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = unset.dataLast('a')({ a: 1, b: 2 });
      expect(result).toEqual({ b: 2 });
    });
  });
});
