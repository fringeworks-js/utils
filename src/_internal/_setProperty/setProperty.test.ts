import setProperty from './setProperty';

describe('setProperty', () => {
  it('通常のプロパティは直接代入する', () => {
    const obj: Record<string, unknown> = {};
    setProperty(obj, 'name', {
      value: 'Alice',
      configurable: true,
      enumerable: true,
      writable: true,
    });
    expect(obj['name']).toBe('Alice');
  });

  it('writableがfalseの場合はdefinePropertyを使う', () => {
    const obj: Record<string, unknown> = {};
    setProperty(obj, 'name', {
      value: 'Alice',
      configurable: true,
      enumerable: true,
      writable: false,
    });
    expect(obj['name']).toBe('Alice');
    expect(Object.getOwnPropertyDescriptor(obj, 'name')?.writable).toBe(false);
  });

  it('getterがある場合はdefinePropertyを使う', () => {
    const obj: Record<string, unknown> = {};
    setProperty(obj, 'x', {
      get: () => 42,
      configurable: true,
      enumerable: true,
    });
    expect(obj['x']).toBe(42);
  });

  it('descriptorがnullの場合は何もしない', () => {
    const obj: Record<string, unknown> = { a: 1 };
    setProperty(obj, 'a', null);
    expect(obj['a']).toBe(1);
  });

  it('__proto__キーはdefinePropertyを使う', () => {
    const obj = Object.create(null) as Record<string, unknown>;
    expect(() =>
      setProperty(obj, '__proto__', {
        value: null,
        configurable: true,
        enumerable: true,
        writable: true,
      }),
    ).not.toThrow();
  });
});
