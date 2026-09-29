import exactKeysFromRecord from './exactKeysFromRecord';

type User = { id: number; name: string; age: number };

describe('exactKeysFromRecord', () => {
  it('キーを記述順で返す', () => {
    expect(
      exactKeysFromRecord<User>({ name: true, id: true, age: true }),
    ).toEqual(['name', 'id', 'age']);
  });

  it('シンボルのキーも返す', () => {
    const sym = Symbol('sym');
    type WithSymbol = { id: number; [sym]: string };
    expect(exactKeysFromRecord<WithSymbol>({ id: true, [sym]: true })).toEqual(
      ['id', sym],
    );
  });

  it('キーのない型は空配列', () => {
    expect(exactKeysFromRecord<object>({})).toEqual([]);
  });

  it('キーが不足していると型エラー', () => {
    // @ts-expect-error age が不足している
    exactKeysFromRecord<User>({ id: true, name: true });
  });

  it('キーが重複していると型エラー', () => {
    // @ts-expect-error id が重複している
    exactKeysFromRecord<User>({ id: true, name: true, age: true, id: true });
  });

  it('余分なキーがあると型エラー', () => {
    // @ts-expect-error email は User のキーではない
    exactKeysFromRecord<User>({ id: true, name: true, age: true, email: true });
  });
});
