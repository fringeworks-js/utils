import exactKeys from './exactKeys';

type User = { id: number; name: string; age: number };

describe('exactKeys', () => {
  it('受け取ったキーの配列をそのまま返す', () => {
    const keys = ['id', 'name', 'age'] as const;
    expect(exactKeys<User>()(keys)).toBe(keys);
  });

  it('型: キーをリテラルのタプルとして返す', () => {
    expectTypeOf(exactKeys<User>()(['id', 'name', 'age'])).toEqualTypeOf<
      readonly ['id', 'name', 'age']
    >();
  });

  it('型: キーの不足・重複・余分はエラーになる', () => {
    // @ts-expect-error 'age' が足りない
    exactKeys<User>()(['id', 'name']);
    // @ts-expect-error 'id' が重複している
    exactKeys<User>()(['id', 'name', 'age', 'id']);
    // @ts-expect-error 'email' は User のキーではない
    exactKeys<User>()(['id', 'name', 'age', 'email']);
  });
});
