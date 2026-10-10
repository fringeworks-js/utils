import filterByValues from './filterByValues';

describe('filterByValues', () => {
  it('conditionを含む値を持つプロパティだけ残す', () => {
    const result = filterByValues(
      { name: 'Alice', city: 'Boston', code: 'XA1' },
      'A',
    );
    expect(result).toEqual({ name: 'Alice', code: 'XA1' });
  });

  it('一致する値がない場合はnullを返す', () => {
    const result = filterByValues({ x: 'hello' }, 'world');
    expect(result).toBeNull();
  });

  it('ネストしたオブジェクトも再帰的に処理する', () => {
    const result = filterByValues(
      { user: { name: 'Alice', code: 'B2' } },
      'Alice',
    );
    expect(result).toEqual({ user: { name: 'Alice' } });
  });

  it('数値と完全一致するプロパティを残す', () => {
    const result = filterByValues({ a: 1, b: 2, c: 1 }, 1);
    expect(result).toEqual({ a: 1, c: 1 });
  });

  it('normalizeで正規化して比較する', () => {
    const result = filterByValues(
      { name: 'ＡＬＩＣＥ', city: 'Boston' },
      'al',
      {
        normalize: (value) => value.normalize('NFKC').toLowerCase(),
      },
    );
    expect(result).toEqual({ name: 'ＡＬＩＣＥ' });
  });

  it('配列を対象にフィルタリングする', () => {
    const result = filterByValues(['Alice', 'Bob', 'Charlie'], 'Ali');
    expect(result).toEqual(['Alice']);
  });

  it('配列内に一致するものがない場合はnullを返す', () => {
    const result = filterByValues(['Alice', 'Bob'], 'xyz');
    expect(result).toBeNull();
  });

  it('conditionがundefinedのとき何にも一致しない', () => {
    const result = filterByValues({ a: 1, b: 'hello' } as any, undefined);
    expect(result).toBeNull();
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = filterByValues.dataLast('A')({
        name: 'Alice',
        city: 'Boston',
      });
      expect(result).toEqual({ name: 'Alice' });
    });
  });
});
