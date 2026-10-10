import isEmptyValue from './isEmptyValue';

describe('isEmptyValue', () => {
  it('undefined', () => {
    const result = isEmptyValue(undefined);
    expect(result).toBe(true);
  });

  it('null', () => {
    const result = isEmptyValue(null);
    expect(result).toBe(true);
  });

  it('空文字', () => {
    const result = isEmptyValue('');
    expect(result).toBe(true);
  });

  it('空配列', () => {
    const result = isEmptyValue([]);
    expect(result).toBe(true);
  });

  it('非空配列', () => {
    const result = isEmptyValue([1, 2, 3]);
    expect(result).toBe(false);
  });
});
