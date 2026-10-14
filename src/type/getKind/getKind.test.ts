import getKind from './getKind';

describe('getKind', () => {
  it('undefined', () => {
    expect(getKind(undefined)).toBe('undefined');
  });

  it('null', () => {
    expect(getKind(null)).toBe('null');
  });

  it('boolean', () => {
    expect(getKind(true)).toBe('boolean');
    expect(getKind(false)).toBe('boolean');
  });

  it('number', () => {
    expect(getKind(42)).toBe('number');
    expect(getKind(0)).toBe('number');
  });

  it('string', () => {
    expect(getKind('hello')).toBe('string');
    expect(getKind('')).toBe('string');
  });

  it('bigint', () => {
    expect(getKind(42n)).toBe('bigint');
  });

  it('symbol', () => {
    expect(getKind(Symbol())).toBe('symbol');
  });

  it('function', () => {
    expect(getKind(() => {})).toBe('function');
  });

  it('array', () => {
    expect(getKind([])).toBe('array');
    expect(getKind([1, 2, 3])).toBe('array');
  });

  it('plainobject', () => {
    expect(getKind({})).toBe('plainobject');
    expect(getKind({ a: 1 })).toBe('plainobject');
  });

  it('date', () => {
    expect(getKind(new Date())).toBe('date');
  });

  it('regexp', () => {
    expect(getKind(/pattern/)).toBe('regexp');
  });

  it('error', () => {
    expect(getKind(new Error())).toBe('error');
  });

  it('map', () => {
    expect(getKind(new Map())).toBe('map');
  });

  it('set', () => {
    expect(getKind(new Set())).toBe('set');
  });

  it('promise', () => {
    expect(getKind(Promise.resolve())).toBe('promise');
  });

  it('weakmap', () => {
    expect(getKind(new WeakMap())).toBe('weakmap');
  });

  it('weakset', () => {
    expect(getKind(new WeakSet())).toBe('weakset');
  });

  it('arraybuffer', () => {
    expect(getKind(new ArrayBuffer(0))).toBe('arraybuffer');
  });

  it('sharedarraybuffer', () => {
    expect(getKind(new SharedArrayBuffer(0))).toBe('sharedarraybuffer');
  });

  it('プロトタイプがnullのオブジェクトはplainobject', () => {
    expect(getKind(Object.create(null))).toBe('plainobject');
  });

  it('どれにも当たらないオブジェクトはinstance', () => {
    class MyClass {}
    expect(getKind(new MyClass())).toBe('instance');
    expect(getKind(Object.create({}))).toBe('instance');
    expect(getKind(new Uint8Array(0))).toBe('instance');
  });

  it('SharedArrayBufferが定義されていない環境でも判定できる', () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'SharedArrayBuffer',
    )!;
    Reflect.deleteProperty(globalThis, 'SharedArrayBuffer');
    try {
      expect(getKind(new Uint8Array(0))).toBe('instance');
    } finally {
      Object.defineProperty(globalThis, 'SharedArrayBuffer', descriptor);
    }
  });
});
