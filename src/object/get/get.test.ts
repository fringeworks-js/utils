import { expectTypeOf } from 'vitest';
import get from './get';

describe('get', () => {
  it('トップレベルのプロパティを取得する', () => {
    expect(get({ a: 1 }, 'a')).toBe(1);
  });

  it('ネストしたプロパティをパスで取得する', () => {
    expect(get({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42);
  });

  it('パスを配列で指定する', () => {
    expect(get({ a: { b: 1 } }, ['a', 'b'])).toBe(1);
  });

  it('存在しないパスはundefinedを返す', () => {
    expect(get({ a: 1 }, 'b')).toBeUndefined();
  });

  it('nullを渡した場合はundefinedを返す', () => {
    expect(get(null, 'a')).toBeUndefined();
  });

  it('undefinedを渡した場合はundefinedを返す', () => {
    expect(get(undefined, 'a')).toBeUndefined();
  });

  it('readonlyの配列や数値のキーでパスを指定できる', () => {
    const path = ['a', 1] as const;
    expect(get({ a: [10, 20] }, path)).toBe(20);
    expect(get([10, 20], 1)).toBe(20);
  });

  it('空のパスはundefinedを返す', () => {
    expect(get({ a: 1 }, '')).toBeUndefined();
    expect(get({ a: 1 }, [])).toBeUndefined();
  });

  describe('プロトタイプ上のプロパティ', () => {
    class User {
      readonly first: string;
      readonly last: string;
      constructor(first: string, last: string) {
        this.first = first;
        this.last = last;
      }
      get fullName() {
        return `${this.first} ${this.last}`;
      }
    }

    it('既定では辿らない', () => {
      expect(get({}, 'toString')).toBeUndefined();
      expect(get({}, 'constructor')).toBeUndefined();
      expect(get({ a: {} }, 'a.hasOwnProperty')).toBeUndefined();
      expect(get(new User('a', 'b'), 'fullName')).toBeUndefined();
      expect(get(new User('a', 'b'), 'first')).toBe('a');
    });

    it('includeInherited: trueで辿る', () => {
      expect(
        get(new User('a', 'b'), 'fullName', { includeInherited: true }),
      ).toBe('a b');
      expect(get({}, 'toString', { includeInherited: true })).toBe(
        Object.prototype.toString,
      );
    });

    it('__proto__はincludeInherited: trueでも辿らない', () => {
      expect(get({}, '__proto__', { includeInherited: true })).toBeUndefined();
    });

    it('プリミティブな値の自身のプロパティは辿る', () => {
      expect(get({ a: 'abc' }, 'a.length')).toBe(3);
      expect(get({ a: 'abc' }, 'a.toUpperCase')).toBeUndefined();
    });
  });

  it('戻り値の型はunknown', () => {
    expectTypeOf(get({ a: 1 }, 'a')).toEqualTypeOf<unknown>();
  });
});
