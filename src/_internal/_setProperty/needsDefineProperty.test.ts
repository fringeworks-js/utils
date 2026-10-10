import needsDefineProperty from './needsDefineProperty';

describe('needsDefineProperty', () => {
  it('__proto__はtrueを返す', () => {
    expect(
      needsDefineProperty('__proto__', {
        value: 1,
        configurable: true,
        enumerable: true,
        writable: true,
      }),
    ).toBe(true);
  });

  it('getterがある場合はtrueを返す', () => {
    expect(needsDefineProperty('key', { get: () => 1 })).toBe(true);
  });

  it('setterがある場合はtrueを返す', () => {
    expect(needsDefineProperty('key', { set: () => {} })).toBe(true);
  });

  it('configurableがfalseの場合はtrueを返す', () => {
    expect(
      needsDefineProperty('key', {
        value: 1,
        configurable: false,
        enumerable: true,
        writable: true,
      }),
    ).toBe(true);
  });

  it('enumerableがfalseの場合はtrueを返す', () => {
    expect(
      needsDefineProperty('key', {
        value: 1,
        configurable: true,
        enumerable: false,
        writable: true,
      }),
    ).toBe(true);
  });

  it('writableがfalseの場合はtrueを返す', () => {
    expect(
      needsDefineProperty('key', {
        value: 1,
        configurable: true,
        enumerable: true,
        writable: false,
      }),
    ).toBe(true);
  });

  it('通常のプロパティはfalseを返す', () => {
    expect(
      needsDefineProperty('key', {
        value: 1,
        configurable: true,
        enumerable: true,
        writable: true,
      }),
    ).toBe(false);
  });
});
