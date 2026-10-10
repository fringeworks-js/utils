import getValidNumber from './getValidNumber';

describe('getValidNumber', () => {
  it('有効な数値はそのまま返す', () => {
    expect(getValidNumber(42)).toBe(42);
  });

  it('0はそのまま返す', () => {
    expect(getValidNumber(0)).toBe(0);
  });

  it('負の数はそのまま返す', () => {
    expect(getValidNumber(-5)).toBe(-5);
  });

  it('nullの場合はデフォルト値を返す', () => {
    expect(getValidNumber(null)).toBe(0);
  });

  it('undefinedの場合はデフォルト値を返す', () => {
    expect(getValidNumber(undefined)).toBe(0);
  });

  it('NaNの場合はデフォルト値を返す', () => {
    expect(getValidNumber(NaN)).toBe(0);
  });

  it('カスタムデフォルト値', () => {
    expect(getValidNumber(null, { invalidValue: 99 })).toBe(99);
  });

  it('Infinityはデフォルトでは無効', () => {
    expect(getValidNumber(Infinity)).toBe(0);
  });

  it('allowInfinity: true でInfinityを許容', () => {
    expect(getValidNumber(Infinity, { allowInfinity: true })).toBe(Infinity);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(getValidNumber.dataLast()(42)).toBe(42);
    });
  });
});
