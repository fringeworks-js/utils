import ensureBoolean from './ensureBoolean';

describe('ensureBoolean', () => {
  it('true', () => {
    expect(ensureBoolean(true)).toBe(true);
  });

  it('false', () => {
    expect(ensureBoolean(false)).toBe(false);
  });

  it('"true"', () => {
    expect(ensureBoolean('true')).toBe(true);
  });

  it('"True"', () => {
    expect(ensureBoolean('True')).toBe(true);
  });

  it('"TRUE"', () => {
    expect(ensureBoolean('TRUE')).toBe(true);
  });

  it('"false"', () => {
    expect(ensureBoolean('false')).toBe(false);
  });

  it('空文字', () => {
    expect(ensureBoolean('')).toBe(false);
  });

  it('null', () => {
    expect(ensureBoolean(null)).toBe(false);
  });

  it('undefined', () => {
    expect(ensureBoolean(undefined)).toBe(false);
  });

  it('1 (truthy)', () => {
    expect(ensureBoolean(1)).toBe(true);
  });

  it('0 (falsy)', () => {
    expect(ensureBoolean(0)).toBe(false);
  });

  describe('trueValues オプション', () => {
    it('カスタムtrueValues', () => {
      expect(ensureBoolean('yes', { trueValues: ['yes'] })).toBe(true);
    });

    it('カスタムtrueValuesに含まれない場合', () => {
      expect(ensureBoolean('true', { trueValues: ['yes'] })).toBe(false);
    });
  });

  describe('ignoreCase オプション', () => {
    it('大文字小文字を無視する', () => {
      expect(
        ensureBoolean('TRUE', { ignoreCase: true, trueValues: ['true'] }),
      ).toBe(true);
    });

    it('大文字小文字を無視しない', () => {
      expect(
        ensureBoolean('TRUE', { ignoreCase: false, trueValues: ['true'] }),
      ).toBe(false);
    });
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(ensureBoolean.dataLast()('true')).toBe(true);
    });

    it('オプション付き', () => {
      expect(ensureBoolean.dataLast({ trueValues: ['yes'] })('yes')).toBe(true);
    });
  });
});
