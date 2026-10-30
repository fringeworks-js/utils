import assignOnlyMutable from './assignOnlyMutable';

describe('assignOnlyMutable', () => {
  it('条件に合う値だけをtargetに代入して同じオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignOnlyMutable(target, { a: 10, b: 20 }, 'a');
    expect(result).toBe(target);
    expect(target).toEqual({ a: 10, b: 2 });
  });

  describe('キー', () => {
    it('キーの配列', () => {
      const result = assignOnlyMutable(
        { a: 1, b: 2, c: 3 },
        { a: 10, b: 20, c: 30 },
        ['a', 'c'],
      );
      expect(result).toEqual({ a: 10, b: 2, c: 30 });
    });

    it('targetに無いキーも代入する', () => {
      const result = assignOnlyMutable({ a: 1 }, { b: 2, c: 3 }, ['b']);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('valuesに無いキーは何もしない', () => {
      const values: { a?: number } = {};
      const result = assignOnlyMutable({ a: 1 }, values, 'a');
      expect(result).toEqual({ a: 1 });
      expect('a' in result).toBe(true);
    });

    it('undefinedの値も代入する', () => {
      const result = assignOnlyMutable({ a: 1 }, { a: undefined }, 'a');
      expect(result).toEqual({ a: undefined });
    });

    it('数値は文字列にして比べる', () => {
      const result = assignOnlyMutable({}, { 0: 'x', 1: 'y' }, [0]);
      expect(result).toEqual({ 0: 'x' });
    });

    it('symbolのキー', () => {
      const symbol = Symbol('s');
      const other = Symbol('o');
      const result = assignOnlyMutable({}, { [symbol]: 1, [other]: 2 }, [
        symbol,
      ]);
      expect(result[symbol]).toBe(1);
      expect(other in result).toBe(false);
    });

    it('条件をデータとして渡せる（型の上でvaluesのキーでない文字列の配列）', () => {
      const keys: string[] = ['a'];
      const result = assignOnlyMutable({ a: 1, b: 2 }, { a: 10, b: 20 }, keys);
      expect(result).toEqual({ a: 10, b: 2 });
    });
  });

  describe('RegExp', () => {
    it('キーが正規表現にマッチするものだけを代入する', () => {
      const result = assignOnlyMutable(
        { a: 1 },
        { onClick: 1, onChange: 2, value: 3 },
        /^on[A-Z]/,
      );
      expect(result).toEqual({ a: 1, onClick: 1, onChange: 2 });
    });

    it('gフラグ付きでも結果が変わらない', () => {
      const result = assignOnlyMutable({}, { aa: 1, ab: 2, ac: 3 }, /^a/g);
      expect(result).toEqual({ aa: 1, ab: 2, ac: 3 });
    });

    it('symbolのキーは代入しない', () => {
      const symbol = Symbol('a');
      const result = assignOnlyMutable({}, { [symbol]: 1, a: 2 }, /a/);
      expect(result).toEqual({ a: 2 });
      expect(symbol in result).toBe(false);
    });
  });

  describe('関数', () => {
    it('真を返したものだけを代入する', () => {
      const result = assignOnlyMutable(
        { a: 1, b: 2 },
        { a: 'x', b: 20, c: 30 },
        (value) => typeof value === 'number',
      );
      expect(result).toEqual({ a: 1, b: 20, c: 30 });
    });

    it('値・キー・targetの今の値を受け取る', () => {
      const predicate = vi.fn(() => true);
      assignOnlyMutable({ a: 1 }, { a: 10, b: 20 }, predicate);
      expect(predicate).toHaveBeenCalledWith(10, 'a', 1);
      expect(predicate).toHaveBeenCalledWith(20, 'b', undefined);
    });

    it('targetの今の値と比べて代入する', () => {
      const result = assignOnlyMutable(
        { a: 5, b: 5 },
        { a: 10, b: 1 },
        (value, _key, targetValue) =>
          (value as number) > (targetValue as number),
      );
      expect(result).toEqual({ a: 10, b: 5 });
    });

    it('__proto__は判定の関数に渡さず、代入しない', () => {
      const predicate = vi.fn(() => true);
      const values = JSON.parse('{"__proto__": {"polluted": true}, "a": 1}');
      const result = assignOnlyMutable({}, values, predicate);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ a: 1 });
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });
  });

  describe('オプション', () => {
    it('includeInherited: 継承したプロパティも対象にする', () => {
      const values = Object.create({ a: 1 }) as { a: number; b: number };
      values.b = 2;
      expect(assignOnlyMutable({}, values, ['a', 'b'])).toEqual({ b: 2 });
      expect(
        assignOnlyMutable({}, values, ['a', 'b'], { includeInherited: true }),
      ).toEqual({ a: 1, b: 2 });
    });

    it('moveToEnd: 代入したキーだけを末尾に移す', () => {
      const result = assignOnlyMutable(
        { a: 1, b: 2, c: 3 },
        { a: 10, b: 20 },
        'a',
        { moveToEnd: true },
      );
      expect(result).toEqual({ a: 10, b: 2, c: 3 });
      expect(Object.keys(result)).toEqual(['b', 'c', 'a']);
    });
  });

  describe('型', () => {
    it('キーを指定した場合は、指定したキーだけが代入される', () => {
      const result = assignOnlyMutable(
        { a: 'x', b: 'y' },
        { a: 1, b: 2, c: 3 },
        ['a', 'c'],
      );
      expectTypeOf(result).toEqualTypeOf<{
        a: number;
        b: string;
        c: number;
      }>();
    });

    it('キーを指定した場合、valuesで省略できるキーはtargetの型を残す', () => {
      const values = {} as { a?: number; b?: number };
      const result = assignOnlyMutable({ a: 'x' }, values, ['a', 'b']);
      expectTypeOf(result.a).toEqualTypeOf<number | string | undefined>();
      expectTypeOf(result.b).toEqualTypeOf<number | undefined>();
    });

    it('関数・RegExpの場合は、valuesのどのキーも代入されない可能性がある', () => {
      const result = assignOnlyMutable({ a: 'x' }, { a: 1, b: 2 }, /a/);
      expectTypeOf(result).toEqualTypeOf<{
        a: string | number;
        b: number | undefined;
      }>();
    });

    it('関数の値の型はvaluesの値の型', () => {
      assignOnlyMutable({}, { a: 1, b: 'x' }, (value) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        return true;
      });
    });
  });
});
