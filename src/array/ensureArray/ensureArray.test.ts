import ensureArray from './ensureArray';

describe('ensureArray', () => {
  it('null', () => {
    const result = ensureArray(null);
    expect(result).toEqual([]);
  });

  it('undefined', () => {
    const result = ensureArray(undefined);
    expect(result).toEqual([]);
  });

  it('空文字', () => {
    const result = ensureArray('');
    expect(result).toEqual(['']);
  });

  it('0', () => {
    const result = ensureArray(0);
    expect(result).toEqual([0]);
  });

  it('false', () => {
    const result = ensureArray(false);
    expect(result).toEqual([false]);
  });

  it('空配列', () => {
    const array: unknown[] = [];
    const result = ensureArray(array);
    expect(result).not.toBe(array);
    expect(result).toEqual(array);
  });

  it('配列', () => {
    const array = [0, 1, 2];
    const result = ensureArray(array);
    expect(result).not.toBe(array);
    expect(result).toEqual(array);
  });

  describe('raw', () => {
    it('raw: true で配列の同一参照を返す', () => {
      const array = [0, 1, 2];
      const result = ensureArray(array, { raw: true });
      expect(result).toBe(array);
    });
  });

  describe('readonly', () => {
    it('readonly の配列を受け付け、複製した配列を返す', () => {
      const data: readonly number[] = [1, 2];
      const result = ensureArray(data);
      expect(result).not.toBe(data);
      expect(result).toEqual([1, 2]);
      expectTypeOf(result).toEqualTypeOf<number[]>();
    });

    it('raw: true の戻り値は readonly の配列', () => {
      const data: readonly number[] = [1, 2];
      expectTypeOf(ensureArray(data, { raw: true })).toEqualTypeOf<
        readonly number[]
      >();
      expectTypeOf(ensureArray([1, 2], { raw: true })).toEqualTypeOf<
        readonly number[]
      >();
    });

    it('raw が boolean の場合の戻り値は readonly の配列', () => {
      const raw = Math.random() > 0.5;
      expectTypeOf(ensureArray([1, 2], { raw })).toEqualTypeOf<
        readonly number[]
      >();
    });

    it('型引数を指定した場合も raw の指定で戻り値の型が決まる', () => {
      expectTypeOf(ensureArray<number>(1)).toEqualTypeOf<number[]>();
      expectTypeOf(ensureArray<number>(1, { raw: true })).toEqualTypeOf<
        readonly number[]
      >();
    });
  });
});
