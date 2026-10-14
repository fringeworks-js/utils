import { isEqual } from '../../compare/isEqual';
import update from './update';

describe('update', () => {
  it('変更を反映した新しいオブジェクトを返す', () => {
    const obj = { a: 1, b: 2 };
    const result = update(obj, { a: 10 });
    expect(result).toEqual({ a: 10, b: 2 });
    expect(result).not.toBe(obj);
  });

  it('objectにないキーも追加する', () => {
    const obj: Record<string, number> = { a: 1 };
    expect(update(obj, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('変更がない場合はobjectをそのまま返す', () => {
    const obj = { a: 1, b: 2 };
    expect(update(obj, { a: 1 })).toBe(obj);
  });

  it('非破壊的でobjectは変更されない', () => {
    const obj = { a: 1 };
    update(obj, { a: 99 });
    expect(obj.a).toBe(1);
  });

  it('isEqualで比較方法を指定できる', () => {
    const obj = { a: { x: 1 } };
    expect(update(obj, { a: { x: 1 } })).not.toBe(obj);
    expect(update(obj, { a: { x: 1 } }, { isEqual })).toBe(obj);
  });

  it('既定ではObject.isで比較する', () => {
    const obj = { a: NaN, b: 0 };
    expect(update(obj, { a: NaN })).toBe(obj);
    expect(update(obj, { b: -0 })).not.toBe(obj);
  });

  it('symbolのキーも更新する', () => {
    const symbol = Symbol('s');
    const obj = { [symbol]: 1 };
    expect(update(obj, { [symbol]: 2 })[symbol]).toBe(2);
  });
  it('__proto__キーは反映しない', () => {
    const obj: any = { a: 1 };
    const result = update(obj, JSON.parse('{"__proto__":{"polluted":1}}'));
    expect(result).toBe(obj);
    expect(result.polluted).toBeUndefined();
  });
});
