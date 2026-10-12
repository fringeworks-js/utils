import transformObject from './transformObject';

describe('transformObject', () => {
  it('文字列ルールで同名のパスにコピーする', () => {
    const result = transformObject({ a: 1, b: 2 }, ['a']);
    expect(result).toEqual({ a: 1 });
  });

  it('fromとtoで別パスに変換できる', () => {
    const result = transformObject({ name: 'Alice' }, [
      { from: 'name', to: 'user.name' },
    ]);
    expect((result as any).user.name).toBe('Alice');
  });

  it('fromが関数の場合は値を算出して設定する', () => {
    const result = transformObject({ a: 1, b: 2 }, [
      { from: (s) => s.a + s.b, to: 'sum' },
    ]);
    expect((result as any).sum).toBe(3);
  });

  it('toが関数の場合は関数でresultを変換する', () => {
    const result = transformObject({ val: 42 }, [
      { from: 'val', to: (t, v) => ({ ...t, computed: (v as number) * 2 }) },
    ]);
    expect((result as any).computed).toBe(84);
  });

  it('removeFromSource: trueでソースのキーを削除する', () => {
    const source = { a: 1, b: 2 };
    transformObject(source, ['a'], { removeFromSource: true });
    expect(source.a).toBeUndefined();
    expect(source.b).toBe(2);
  });

  it('ルールのremoveFromSourceでルール単位のソース削除', () => {
    const source = { a: 1, b: 2 };
    transformObject(source, [{ from: 'a', to: 'a', removeFromSource: true }]);
    expect(source.a).toBeUndefined();
    expect(source.b).toBe(2);
  });

  it('sourceがnullの場合は空オブジェクトを返す', () => {
    const result = transformObject(null as any, ['a']);
    expect(result).toEqual({});
  });

  it('fromが関数でtoが未指定の場合は設定しない', () => {
    const result = transformObject({ a: 1, b: 2 }, [
      { from: (s: { a: number; b: number }) => s.a + s.b },
    ] as any);
    expect(result).toEqual({});
  });

  it('toが未指定のとき文字列fromと同名キーにコピーする', () => {
    const result = transformObject({ name: 'Alice' }, [{ from: 'name' }]);
    expect((result as any).name).toBe('Alice');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = transformObject.dataLast(['a'])({ a: 1, b: 2 });
      expect(result).toEqual({ a: 1 });
    });
  });
});
