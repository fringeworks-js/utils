import limitPositiveNumber from './limitPositiveNumber';

describe('limitPositiveNumber', () => {
  it('正の数はそのまま返す', () => {
    expect(limitPositiveNumber(5)).toBe(5);
    expect(limitPositiveNumber(0.1)).toBe(0.1);
  });

  it('nullはnullを返す', () => {
    expect(limitPositiveNumber(null)).toBeNull();
  });

  it('undefinedはundefinedを返す', () => {
    expect(limitPositiveNumber(undefined)).toBeUndefined();
  });

  it('負の数はデフォルトでnullを返す', () => {
    expect(limitPositiveNumber(-5)).toBeNull();
  });

  it('0はデフォルトでnullを返す', () => {
    expect(limitPositiveNumber(0)).toBeNull();
    expect(limitPositiveNumber(-0)).toBeNull();
  });

  it('NaNはデフォルトでnullを返す', () => {
    expect(limitPositiveNumber(NaN)).toBeNull();
  });

  it('zeroValueを指定すると0のときにその値を返す', () => {
    expect(limitPositiveNumber(0, { zeroValue: 0 })).toBe(0);
  });

  it('nanValueを指定するとNaNのときにその値を返す', () => {
    expect(limitPositiveNumber(NaN, { nanValue: 0 })).toBe(0);
  });

  it('null/undefinedはそのまま返す', () => {
    expect(limitPositiveNumber(null)).toBeNull();
    expect(limitPositiveNumber(undefined)).toBeUndefined();
  });

  describe('negativeValue', () => {
    it('negativeValueを指定すると負の数のときにその値を返す', () => {
      expect(limitPositiveNumber(-5, { negativeValue: 0 })).toBe(0);
    });

    it('negativeValue: "abs"で絶対値を返す', () => {
      expect(limitPositiveNumber(-5, { negativeValue: 'abs' })).toBe(5);
    });
  });

  it('undefinedのオプションは指定しなかったものとして扱う', () => {
    const options = {
      nanValue: undefined,
      zeroValue: undefined,
      negativeValue: undefined,
    };
    expect(limitPositiveNumber(NaN, options)).toBeNull();
    expect(limitPositiveNumber(0, options)).toBeNull();
    expect(limitPositiveNumber(-1, options)).toBeNull();
  });

  it('nullを指定した場合はnullを返す', () => {
    expect(limitPositiveNumber(0, { zeroValue: null })).toBeNull();
  });
});
