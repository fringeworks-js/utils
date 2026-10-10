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

  it('modeで比較方法を指定できる', () => {
    const obj = { a: { x: 1 } };
    expect(update(obj, { a: { x: 1 } })).not.toBe(obj);
    expect(update(obj, { a: { x: 1 } }, { mode: 'deep' })).toBe(obj);
  });

  it('objectがnullの場合はnullを返す', () => {
    expect(update(null as any, { a: 1 })).toBeNull();
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = update.dataLast({ a: 10 })({ a: 1, b: 2 });
      expect(result).toEqual({ a: 10, b: 2 });
    });
  });
});
