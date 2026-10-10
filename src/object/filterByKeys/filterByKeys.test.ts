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

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = filterByKeys.dataLast('name')({ name: 'Alice', age: 30 });
      expect(result).toEqual({ name: 'Alice' });
    });
  });
});
