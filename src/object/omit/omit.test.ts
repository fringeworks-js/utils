import { expectTypeOf } from 'vitest';
import omit from './omit';

describe('omit', () => {
  it('指定したキーを除外したオブジェクトを返す', () => {
    const result = omit({ a: 1, b: 2, c: 3 }, 'b');
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('複数のキーを配列で指定できる', () => {
    const result = omit({ a: 1, b: 2, c: 3 }, ['a', 'c']);
    expect(result).toEqual({ b: 2 });
  });

  it('キーをパスとして解釈しない', () => {
    const result = omit({ a: { b: 1 }, b: 2, 'a.b': 3 }, 'a.b');
    expect(result).toEqual({ a: { b: 1 }, b: 2 });
  });

  it('nullを渡した場合はundefinedを返す', () => {
    expect(omit(null, 'a')).toBeUndefined();
  });

  it('戻り値の型から指定したキーが除かれる', () => {
    const data = { a: 1, b: 'x', c: true };
    expectTypeOf(omit(data, 'a')).toEqualTypeOf<{ b: string; c: boolean }>();
    expectTypeOf(omit(data, ['a', 'c'])).toEqualTypeOf<{ b: string }>();
    expectTypeOf(omit(data, ['a', 'c'] as const)).toEqualTypeOf<{
      b: string;
    }>();
  });

  it('dataに無いキーも指定できる', () => {
    const key: string = 'z';
    expect(omit({ a: 1 }, key)).toEqual({ a: 1 });
  });

  it('dataがnull/undefinedになりうる場合は戻り値にundefinedを含む', () => {
    const data = null as { a: number; b: number } | null;
    expectTypeOf(omit(data, 'a')).toEqualTypeOf<{ b: number } | undefined>();
  });
});
