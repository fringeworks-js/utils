import isEmptyCollection from './isEmptyCollection';

describe('isEmptyCollection', () => {
  it('undefinedはfalseを返す', () => {
    const result = isEmptyCollection(undefined);
    expect(result).toBe(false);
  });

  it('nullはfalseを返す', () => {
    const result = isEmptyCollection(null);
    expect(result).toBe(false);
  });

  it('空配列', () => {
    const result = isEmptyCollection([]);
    expect(result).toBe(true);
  });

  it('非空配列', () => {
    const result = isEmptyCollection([1, 2, 3]);
    expect(result).toBe(false);
  });

  it('空Set', () => {
    const result = isEmptyCollection(new Set());
    expect(result).toBe(true);
  });

  it('非空Set', () => {
    const set = new Set();
    set.add(1);
    const result = isEmptyCollection(set);
    expect(result).toBe(false);
  });

  it('空Map', () => {
    const result = isEmptyCollection(new Map());
    expect(result).toBe(true);
  });

  it('非空Map', () => {
    const map = new Map();
    map.set('key', 'value');
    const result = isEmptyCollection(map);
    expect(result).toBe(false);
  });

  it('プレーンオブジェクトはfalseを返す', () => {
    expect(isEmptyCollection({})).toBe(false);
  });

  it('数値はfalseを返す', () => {
    expect(isEmptyCollection(42)).toBe(false);
  });
});
