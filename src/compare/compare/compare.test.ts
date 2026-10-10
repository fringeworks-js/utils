import compare from './compare';

describe('compare', () => {
  it('=== 等値', () => {
    expect(compare(1, '===', 1)).toBe(true);
    expect(compare(1, '===', 2)).toBe(false);
  });

  it('!== 非等値', () => {
    expect(compare(1, '!==', 2)).toBe(true);
    expect(compare(1, '!==', 1)).toBe(false);
  });

  it('> より大きい', () => {
    expect(compare(2, '>', 1)).toBe(true);
    expect(compare(1, '>', 2)).toBe(false);
  });

  it('< より小さい', () => {
    expect(compare(1, '<', 2)).toBe(true);
    expect(compare(2, '<', 1)).toBe(false);
  });

  it('>= 以上', () => {
    expect(compare(2, '>=', 2)).toBe(true);
    expect(compare(3, '>=', 2)).toBe(true);
    expect(compare(1, '>=', 2)).toBe(false);
  });

  it('<= 以下', () => {
    expect(compare(2, '<=', 2)).toBe(true);
    expect(compare(1, '<=', 2)).toBe(true);
    expect(compare(3, '<=', 2)).toBe(false);
  });

  it('== 緩い比較', () => {
    expect(compare(1, '==', '1')).toBe(true);
    expect(compare(null, '==', undefined)).toBe(true);
    expect(compare(1, '==', 2)).toBe(false);
  });

  it('!= 緩い否定', () => {
    expect(compare(1, '!=', 2)).toBe(true);
    expect(compare(1, '!=', '1')).toBe(false);
  });

  it('between 範囲内', () => {
    expect(compare(5, 'between', [0, 10])).toBe(true);
    expect(compare(0, 'between', [0, 10])).toBe(true);
    expect(compare(10, 'between', [0, 10])).toBe(true);
    expect(compare(11, 'between', [0, 10])).toBe(false);
  });

  it('in 配列に含まれる', () => {
    expect(compare(2, 'in', [1, 2, 3])).toBe(true);
    expect(compare(5, 'in', [1, 2, 3])).toBe(false);
  });

  it('like 部分一致', () => {
    expect(compare('hello world', 'like', 'hello')).toBe(true);
    expect(compare('hello world', 'like', 'xyz')).toBe(false);
  });

  it('未対応の演算子はエラーをスロー', () => {
    expect(() => compare(1, 'invalid' as any, 1)).toThrow(
      '[compare] Unsupported operator: invalid',
    );
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(compare.dataLast('===', 1)(1)).toBe(true);
    });
  });
});
