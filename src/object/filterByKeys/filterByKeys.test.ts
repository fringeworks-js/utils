import { expectTypeOf } from 'vitest';
import filterByKeys from './filterByKeys';

describe('filterByKeys', () => {
  it('conditionを含むキーだけ残す', () => {
    const result = filterByKeys(
      { name: 'Alice', age: 30, nickname: 'Al' },
      'name',
    );
    expect(result).toEqual({ name: 'Alice', nickname: 'Al' });
  });

  it('一致するキーがない場合はnullを返す', () => {
    const result = filterByKeys({ age: 30 }, 'name');
    expect(result).toBeNull();
  });

  it('ネストしたオブジェクトも再帰的に処理する', () => {
    const result = filterByKeys(
      { user: { name: 'Alice', age: 30 }, count: 1 },
      'name',
    );
    expect(result).toEqual({ user: { name: 'Alice' } });
  });

  it('配列もサポートする', () => {
    const result = filterByKeys(
      [
        { name: 'A', x: 1 },
        { name: 'B', x: 2 },
      ],
      'name',
    );
    expect(result).toEqual([{ name: 'A' }, { name: 'B' }]);
  });

  it('normalizeで正規化して比較する', () => {
    const result = filterByKeys({ AGE: 30, name: 'Alice' }, 'age', {
      normalize: (value) => value.toLowerCase(),
    });
    expect(result).toEqual({ AGE: 30 });
  });

  it('数値の条件はキーと完全一致で比較する', () => {
    expect(filterByKeys({ 0: 'x', 10: 'y', a: { 0: 'z' } }, 0)).toEqual({
      0: 'x',
      a: { 0: 'z' },
    });
  });

  it('継承したプロパティと同名のキーも子要素を処理する', () => {
    const result = filterByKeys(
      { toString: { name: 1 }, constructor: { name: 2 } },
      'name',
    );
    expect(result).toEqual({ toString: { name: 1 }, constructor: { name: 2 } });
  });

  it('__proto__キーは読み飛ばす', () => {
    const data = JSON.parse('{"__proto__":{"name":1},"name":2}');
    const result: any = filterByKeys(data, 'name');
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result).toEqual({ name: 2 });
  });

  it('戻り値の型はunknown', () => {
    expectTypeOf(filterByKeys({ name: 'A' }, 'name')).toEqualTypeOf<unknown>();
  });
});
