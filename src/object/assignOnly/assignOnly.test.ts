import assignOnly from './assignOnly';

describe('assignOnly', () => {
  it('条件に合う値だけを代入した新しいオブジェクトを返す', () => {
    const target = { a: 1, b: 2 };
    const result = assignOnly(target, { a: 10, b: 20 }, ['a']);
    expect(result).toEqual({ a: 10, b: 2 });
    expect(result).not.toBe(target);
  });

  it('非破壊的でtargetは変更されない', () => {
    const target = { a: 1 };
    assignOnly(target, { a: 99 }, 'a');
    expect(target.a).toBe(1);
  });

  it('RegExp・関数の条件も受け付ける', () => {
    expect(assignOnly({}, { a: 1, b: 2 }, /a/)).toEqual({ a: 1 });
    expect(assignOnly({}, { a: 1, b: 2 }, (value) => value === 2)).toEqual({
      b: 2,
    });
  });

  it('moveToEnd: 代入したキーだけを末尾に移す', () => {
    const result = assignOnly({ a: 1, b: 2 }, { a: 10 }, 'a', {
      moveToEnd: true,
    });
    expect(Object.keys(result)).toEqual(['b', 'a']);
  });

  it('型: キーを指定した場合は、指定したキーだけが代入される', () => {
    const result = assignOnly({ a: 'x' }, { a: 1, b: 2 }, 'b');
    expectTypeOf(result).toEqualTypeOf<{ a: string; b: number }>();
  });
});
