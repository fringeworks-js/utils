import compare from './compare';
import { ComparisonOperator } from './constants';

describe('compare', () => {
  it('=== 等値', () => {
    expect(compare(1, '===', 1)).toBe(true);
    expect(compare(1, '===', 2)).toBe(false);
  });

  it('!== 非等値', () => {
    expect(compare(1, '!==', 2)).toBe(true);
    expect(compare(1, '!==', 1)).toBe(false);
  });

  it('> より大きい', () => {
    expect(compare(2, '>', 1)).toBe(true);
    expect(compare(1, '>', 2)).toBe(false);
  });

  it('< より小さい', () => {
    expect(compare(1, '<', 2)).toBe(true);
    expect(compare(2, '<', 1)).toBe(false);
  });

  it('>= 以上', () => {
    expect(compare(2, '>=', 2)).toBe(true);
    expect(compare(3, '>=', 2)).toBe(true);
    expect(compare(1, '>=', 2)).toBe(false);
  });

  it('<= 以下', () => {
    expect(compare(2, '<=', 2)).toBe(true);
    expect(compare(1, '<=', 2)).toBe(true);
    expect(compare(3, '<=', 2)).toBe(false);
  });

  it('== 緩い比較', () => {
    expect(compare(1, '==', '1')).toBe(true);
    expect(compare(null, '==', undefined)).toBe(true);
    expect(compare(1, '==', 2)).toBe(false);
  });

  it('!= 緩い否定', () => {
    expect(compare(1, '!=', 2)).toBe(true);
    expect(compare(1, '!=', '1')).toBe(false);
  });

  it('大小比較は文字列や Date にも使える', () => {
    expect(compare('b', '>', 'a')).toBe(true);
    expect(compare(new Date(2024, 0, 2), '>', new Date(2024, 0, 1))).toBe(true);
    expect(compare('b', 'between', ['a', 'c'])).toBe(true);
  });

  it('deepEqual / notDeepEqual 構造の比較', () => {
    expect(compare({ a: [1] }, 'deepEqual', { a: [1] })).toBe(true);
    expect(compare({ a: [1] }, 'deepEqual', { a: [2] })).toBe(false);
    expect(compare({ a: [1] }, 'notDeepEqual', { a: [2] })).toBe(true);
    expect(compare({ a: [1] }, 'notDeepEqual', { a: [1] })).toBe(false);
  });

  it('between 範囲内', () => {
    expect(compare(5, 'between', [0, 10])).toBe(true);
    expect(compare(0, 'between', [0, 10])).toBe(true);
    expect(compare(10, 'between', [0, 10])).toBe(true);
    expect(compare(11, 'between', [0, 10])).toBe(false);
  });

  it('notBetween 範囲外', () => {
    expect(compare(11, 'notBetween', [0, 10])).toBe(true);
    expect(compare(-1, 'notBetween', [0, 10])).toBe(true);
    expect(compare(0, 'notBetween', [0, 10])).toBe(false);
    expect(compare(10, 'notBetween', [0, 10])).toBe(false);
  });

  it('between の min が max より大きい場合は常に範囲外', () => {
    expect(compare(5, 'between', [10, 0])).toBe(false);
    expect(compare(5, 'notBetween', [10, 0])).toBe(true);
  });

  it('oneOf / notOneOf 配列のいずれかと等しい', () => {
    expect(compare(2, 'oneOf', [1, 2, 3])).toBe(true);
    expect(compare(5, 'oneOf', [1, 2, 3])).toBe(false);
    expect(compare(5, 'notOneOf', [1, 2, 3])).toBe(true);
    expect(compare(2, 'notOneOf', [1, 2, 3])).toBe(false);
  });

  it('includes / notIncludes 文字列の部分一致', () => {
    expect(compare('hello world', 'includes', 'hello')).toBe(true);
    expect(compare('hello world', 'includes', 'xyz')).toBe(false);
    expect(compare('hello world', 'notIncludes', 'xyz')).toBe(true);
    expect(compare('hello world', 'notIncludes', 'hello')).toBe(false);
  });

  it('includes / notIncludes 配列の要素', () => {
    expect(compare(['a', 'b'], 'includes', 'a')).toBe(true);
    expect(compare(['a', 'b'], 'includes', 'c')).toBe(false);
    expect(compare([NaN], 'includes', NaN)).toBe(true);
    expect(compare(['a', 'b'], 'notIncludes', 'c')).toBe(true);
    expect(compare(['a', 'b'], 'notIncludes', 'a')).toBe(false);
  });

  it('includesAll すべて含む', () => {
    expect(compare(['a', 'b', 'c'], 'includesAll', ['a', 'c'])).toBe(true);
    expect(compare(['a', 'b', 'c'], 'includesAll', ['a', 'd'])).toBe(false);
    expect(compare('hello world', 'includesAll', ['hello', 'world'])).toBe(
      true,
    );
    expect(compare('hello world', 'includesAll', ['hello', 'xyz'])).toBe(false);
    expect(compare(['a'], 'includesAll', [])).toBe(true);
  });

  it('includesAny いずれかを含む', () => {
    expect(compare(['a', 'b', 'c'], 'includesAny', ['x', 'c'])).toBe(true);
    expect(compare(['a', 'b', 'c'], 'includesAny', ['x', 'y'])).toBe(false);
    expect(compare('hello world', 'includesAny', ['xyz', 'world'])).toBe(true);
    expect(compare('hello world', 'includesAny', ['xyz', 'abc'])).toBe(false);
    expect(compare(['a'], 'includesAny', [])).toBe(false);
  });

  it('startsWith / endsWith 前方一致・後方一致', () => {
    expect(compare('hello world', 'startsWith', 'hello')).toBe(true);
    expect(compare('hello world', 'startsWith', 'world')).toBe(false);
    expect(compare('hello world', 'endsWith', 'world')).toBe(true);
    expect(compare('hello world', 'endsWith', 'hello')).toBe(false);
  });

  it('matches 正規表現に一致する', () => {
    expect(compare('hello world', 'matches', /^hel+o/)).toBe(true);
    expect(compare('hello world', 'matches', /^world/)).toBe(false);
    expect(compare('Hello', 'matches', /hello/i)).toBe(true);
  });

  it('matches 文字列のパターンは正規表現に変換する', () => {
    expect(compare('hello world', 'matches', '^hel+o')).toBe(true);
    expect(compare('hello world', 'matches', '^world')).toBe(false);
  });

  it('matches g フラグの正規表現でも結果が変わらず、lastIndex も変えない', () => {
    const pattern = /o/g;
    expect(compare('hello', 'matches', pattern)).toBe(true);
    expect(compare('hello', 'matches', pattern)).toBe(true);
    expect(pattern.lastIndex).toBe(0);
  });

  it('未対応の演算子はエラーをスロー', () => {
    expect(() => compare(1, 'invalid' as any, 1)).toThrow(
      '[compare] Unsupported operator: invalid',
    );
  });

  it('プロトタイプのプロパティ名は演算子として扱わない', () => {
    expect(() => compare(1, 'constructor' as any, 1)).toThrow(
      '[compare] Unsupported operator: constructor',
    );
  });

  describe('想定していない形の値は否定の演算子も含めてfalse', () => {
    it('between / notBetween の範囲が配列でない', () => {
      expect(compare(1, 'between', null as any)).toBe(false);
      expect(compare(1, 'notBetween', null as any)).toBe(false);
    });

    it('oneOf / notOneOf の候補が配列でない', () => {
      expect(compare(1, 'oneOf', null as any)).toBe(false);
      expect(compare(1, 'notOneOf', null as any)).toBe(false);
    });

    it('includes / notIncludes の対象が文字列・配列でない', () => {
      expect(compare(1 as any, 'includes', 1)).toBe(false);
      expect(compare(1 as any, 'notIncludes', 1)).toBe(false);
    });

    it('includes / notIncludes で文字列から文字列以外を探す', () => {
      expect(compare('1', 'includes', 1)).toBe(false);
      expect(compare('1', 'notIncludes', 1)).toBe(false);
    });

    it('includesAll / includesAny の対象・候補が不正', () => {
      expect(compare(1 as any, 'includesAll', [])).toBe(false);
      expect(compare(['a'], 'includesAll', null as any)).toBe(false);
      expect(compare('a', 'includesAll', [1])).toBe(false);
      expect(compare(1 as any, 'includesAny', [1])).toBe(false);
      expect(compare(['a'], 'includesAny', null as any)).toBe(false);
    });

    it('startsWith / endsWith の値が文字列でない', () => {
      expect(compare(1 as any, 'startsWith', '1')).toBe(false);
      expect(compare('1', 'endsWith', 1 as any)).toBe(false);
    });

    it('matches の値が文字列でない・パターンが不正', () => {
      expect(compare(1 as any, 'matches', /1/)).toBe(false);
      expect(compare('a', 'matches', 1 as any)).toBe(false);
      expect(compare('(', 'matches', '(')).toBe(false);
    });
  });

  it('演算子ごとに引数の型が決まる', () => {
    expectTypeOf(compare<'between'>)
      .parameter(2)
      .toEqualTypeOf<readonly [unknown, unknown]>();
    expectTypeOf(compare<'oneOf'>)
      .parameter(2)
      .toEqualTypeOf<readonly unknown[]>();
    expectTypeOf(compare<'includes'>)
      .parameter(0)
      .toEqualTypeOf<string | readonly unknown[]>();
    expectTypeOf(compare<'matches'>)
      .parameter(2)
      .toEqualTypeOf<RegExp | string>();
    // @ts-expect-error between の範囲は配列
    compare(1, 'between', 5);
    // @ts-expect-error includes の対象は文字列か配列
    compare(1, 'includes', '1');
    // @ts-expect-error startsWith の値は文字列
    compare(1, 'startsWith', '1');
  });

  it('ComparisonOperator の値を演算子として使える', () => {
    expect(compare(2, ComparisonOperator.gte, 2)).toBe(true);
    expect(compare([1], ComparisonOperator.deepEqual, [1])).toBe(true);
  });
});
