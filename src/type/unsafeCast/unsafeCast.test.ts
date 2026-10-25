import unsafeCast from './unsafeCast';

describe('unsafeCast', () => {
  it('値をそのまま返す', () => {
    const value = { a: 1 };
    expect(unsafeCast(value)).toBe(value);
  });

  it('型: 型引数で指定した型を返す', () => {
    expectTypeOf(unsafeCast<string>(1)).toEqualTypeOf<string>();
  });
});
