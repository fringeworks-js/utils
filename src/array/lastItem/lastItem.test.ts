import lastItem from './lastItem';

describe('lastItem', () => {
  it('最後の要素を返す', () => {
    expect(lastItem([0, 1, 2])).toBe(2);
  });

  it('1要素', () => {
    expect(lastItem(['a'])).toBe('a');
  });

  it('空配列はundefined', () => {
    expect(lastItem([])).toBeUndefined();
  });

  it('null・undefinedはundefined', () => {
    expect(lastItem(null)).toBeUndefined();
    expect(lastItem(undefined)).toBeUndefined();
  });

  it('readonlyの配列を受け付ける', () => {
    const array = [1, 2, 3] as const;
    const result = lastItem(array);
    expect(result).toBe(3);
    expectTypeOf(result).toEqualTypeOf<1 | 2 | 3 | undefined>();
  });
});
