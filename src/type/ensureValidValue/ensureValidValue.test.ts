import ensureValidValue from './ensureValidValue';

describe('ensureValidValue', () => {
  it('nullでない値はそのまま返す', () => {
    expect(ensureValidValue(42)).toBe(42);
    expect(ensureValidValue('hello')).toBe('hello');
  });

  it('undefinedはそのまま返す（オプションなし）', () => {
    expect(ensureValidValue(undefined)).toBeUndefined();
  });

  it('nullはそのまま返す（オプションなし）', () => {
    expect(ensureValidValue(null)).toBeNull();
  });

  describe('undefinedValue', () => {
    it('undefinedの場合にundefinedValueを返す', () => {
      expect(ensureValidValue(undefined, { undefinedValue: 0 })).toBe(0);
    });

    it('nullの場合はundefinedValueを使わない', () => {
      expect(ensureValidValue(null, { undefinedValue: 0 })).toBeNull();
    });
  });

  describe('nullValue', () => {
    it('nullの場合にnullValueを返す', () => {
      expect(ensureValidValue(null, { nullValue: 0 })).toBe(0);
    });

    it('undefinedの場合はnullValueを使わない', () => {
      expect(ensureValidValue(undefined, { nullValue: 0 })).toBeUndefined();
    });
  });

  describe('validType', () => {
    it('指定した型の場合はそのまま返す', () => {
      expect(ensureValidValue(42, { validType: 'number' })).toBe(42);
    });

    it('指定した型でない場合はそのまま返す（invalidValueなし）', () => {
      expect(ensureValidValue('hello', { validType: 'number' })).toBe('hello');
    });

    it('指定した型でない場合はinvalidValueを返す', () => {
      expect(
        ensureValidValue('hello', { validType: 'number', invalidValue: 0 }),
      ).toBe(0);
    });

    it('validType指定時にundefinedはundefinedValueを返す', () => {
      expect(
        ensureValidValue(undefined, { validType: 'number', undefinedValue: 0 }),
      ).toBe(0);
    });

    it('validType指定時にnullはnullValueを返す', () => {
      expect(
        ensureValidValue(null, { validType: 'number', nullValue: 0 }),
      ).toBe(0);
    });
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(ensureValidValue.dataLast({ undefinedValue: 0 })(undefined)).toBe(
        0,
      );
    });
  });
});
