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

  it('removeFromSourceで配列の要素を削除してもほかのルールのインデックスがずれない', () => {
    const source = { a: [0, 1, 2, 3], b: 1 };
    const result = transformObject(
      source,
      [
        { from: 'a.0', to: 'x' },
        { from: 'a.2', to: 'z' },
        { from: 'a.1', to: 'y' },
        { from: 'a.0', to: 'w' },
      ],
      { removeFromSource: true },
    );
    expect(result).toEqual({ x: 0, z: 2, y: 1, w: 0 });
    expect(source).toEqual({ a: [3], b: 1 });
  });

  it('removeFromSourceで2桁のインデックスや書き方の違うパスも正しく削除する', () => {
    const source = { a: Array.from({ length: 12 }, (_, i) => i) };
    transformObject(
      source,
      [
        { from: 'a[9]', to: 'x' },
        { from: 'a.10', to: 'y' },
        { from: 'a[10]', to: 'z' },
      ],
      { removeFromSource: true },
    );
    expect(source.a).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 11]);
  });

  it('removeFromSourceで削除する前のsourceを関数のfromに渡す', () => {
    const source = { a: 1 };
    const result = transformObject(source, [
      { from: 'a', to: 'x', removeFromSource: true },
      { from: (s) => s['a'], to: 'y' },
    ]);
    expect(result).toEqual({ x: 1, y: 1 });
    expect(source).toEqual({});
  });

  it('removeFromSourceで祖先と子孫のパスを両方削除できる', () => {
    const source = { a: [{ b: 1 }, { b: 2 }], c: 3 };
    transformObject(source, ['a', 'a.1.b', 'a.0'], { removeFromSource: true });
    expect(source).toEqual({ c: 3 });
  });

  it('fromとtoに配列のパスを指定できる', () => {
    const source = { 'a.b': 1, c: { d: 2 } };
    const result = transformObject(
      source,
      [
        { from: ['a.b'], to: ['x', 'y.z'] },
        { from: ['c', 'd'], to: 'w' },
      ],
      { removeFromSource: true },
    );
    expect(result).toEqual({ x: { 'y.z': 1 }, w: 2 });
    expect(source).toEqual({ c: {} });
  });

  it('関数のfromにはtoが必須で、removeFromSourceは指定できない', () => {
    const source = { a: 1 };
    // @ts-expect-error toが無い
    transformObject(source, [{ from: (s) => s.a }]);
    transformObject(source, [
      // @ts-expect-error removeFromSourceは指定できない
      { from: (s) => s.a, to: 'x', removeFromSource: true },
    ]);
    expect(source).toEqual({ a: 1 });
  });
});
