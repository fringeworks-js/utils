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

  it('"1"', () => {
    expect(ensureBoolean('1')).toBe(true);
    expect(ensureBoolean('0')).toBe(false);
  });

  it('前後の空白は無視する', () => {
    expect(ensureBoolean(' true ')).toBe(true);
    expect(ensureBoolean('\t1\n')).toBe(true);
    expect(ensureBoolean(' yes ', { trueValues: ['yes'] })).toBe(true);
  });

  it('"tRUE" はデフォルトでは false', () => {
    expect(ensureBoolean('tRUE')).toBe(false);
  });

  it('オブジェクト・配列は truthy', () => {
    expect(ensureBoolean({})).toBe(true);
    expect(ensureBoolean([])).toBe(true);
  });

  describe('trueValues オプション', () => {
    it('readonly の配列を渡せる', () => {
      const trueValues = ['yes', 'on'] as const;
      expect(ensureBoolean('on', { trueValues })).toBe(true);
    });

    it('空の配列の場合はどの文字列も false', () => {
      expect(ensureBoolean('true', { trueValues: [] })).toBe(false);
    });

    it('文字列以外の値には使わない', () => {
      expect(ensureBoolean(0, { trueValues: ['0'] })).toBe(false);
    });

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

    it('trueValues を指定しない場合もデフォルトの値と大文字小文字を無視して比較する', () => {
      expect(ensureBoolean('tRUE', { ignoreCase: true })).toBe(true);
    });

    it('trueValues に大文字が含まれていても無視して比較する', () => {
      expect(
        ensureBoolean('yes', { ignoreCase: true, trueValues: ['YES'] }),
      ).toBe(true);
    });

    it('大文字小文字を無視しない', () => {
      expect(
        ensureBoolean('TRUE', { ignoreCase: false, trueValues: ['true'] }),
      ).toBe(false);
    });
  });
});
