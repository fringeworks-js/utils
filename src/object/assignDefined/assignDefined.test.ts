import assignDefined from './assignDefined';

describe('assignDefined', () => {
  it('undefinedでない値のみ適用して新しいオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignDefined(target, { a: 10, b: undefined });
    expect(result.a).toBe(10);
    expect(result.b).toBe(2);
    expect(result).not.toBe(target);
  });

  it('interfaceで定義した型のオブジェクトを渡せる', () => {
    interface Options {
      size: number;
      color?: string;
    }
    const options: Options = { size: 1 };
    const values: Partial<Options> = { color: 'red', size: undefined };
    expect(assignDefined(options, values)).toEqual({ size: 1, color: 'red' });
  });

  it('非破壊的でtargetは変更されない', () => {
    const target = { a: 1 };
    assignDefined(target, { a: 99 });
    expect(target.a).toBe(1);
  });

  it('nullは代入する', () => {
    const result = assignDefined({ a: 1 as number | null }, { a: null });
    expect(result.a).toBeNull();
  });

  it('型: undefinedになりうるキーだけtargetの型を残す', () => {
    const values = {} as { a: number | null; b: number | undefined };
    const result = assignDefined({ a: 'x', b: 'y' }, values);
    expectTypeOf(result.a).toEqualTypeOf<number | null>();
    expectTypeOf(result.b).toEqualTypeOf<number | string>();
  });

  it('symbolのキーも反映する', () => {
    const symbol = Symbol('s');
    const result = assignDefined({ a: 1 }, { [symbol]: 2 });
    expect(result[symbol]).toBe(2);
  });

  describe('moveToEnd', () => {
    it('代入したキーを末尾に移す', () => {
      const result = assignDefined(
        { a: 1, b: 2, c: 3 },
        { a: 10, b: undefined, d: 4 },
        { moveToEnd: true },
      );
      expect(result).toEqual({ a: 10, b: 2, c: 3, d: 4 });
      expect(Object.keys(result)).toEqual(['b', 'c', 'a', 'd']);
    });

    it('values の中の並び順を保つ', () => {
      const result = assignDefined(
        { a: 1, b: 2, c: 3 },
        { b: 20, a: 10 },
        { moveToEnd: true },
      );
      expect(Object.keys(result)).toEqual(['c', 'b', 'a']);
    });

    it('指定しなければ、既存のキーは元の位置に残る', () => {
      const result = assignDefined({ a: 1, b: 2 }, { a: 10 });
      expect(Object.keys(result)).toEqual(['a', 'b']);
    });

    it('省略形と個別指定のスタイルで、values の指定が後ろに並ぶ', () => {
      const result = assignDefined(
        { fontSize: '12px', whiteSpace: 'pre' },
        { font: '16px serif', fontSize: '20px' },
        { moveToEnd: true },
      );
      expect(Object.keys(result)).toEqual(['whiteSpace', 'font', 'fontSize']);
    });

    it('整数のキーは常に先頭に並ぶ', () => {
      const result = assignDefined(
        { a: 1, 0: 'x' },
        { 0: 'y' },
        { moveToEnd: true },
      );
      expect(Object.keys(result)).toEqual(['0', 'a']);
    });
  });
});
