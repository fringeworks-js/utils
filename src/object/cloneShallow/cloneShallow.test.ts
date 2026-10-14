import cloneShallow from './cloneShallow';

describe('cloneShallow', () => {
  it('nullはそのまま返す', () => {
    expect(cloneShallow(null)).toBeNull();
  });

  it('プリミティブはそのまま返す', () => {
    expect(cloneShallow(42)).toBe(42);
    expect(cloneShallow('hello')).toBe('hello');
  });

  it('オブジェクトをシャローコピーする', () => {
    const inner = { x: 1 };
    const obj = { a: inner, b: 2 };
    const clone = cloneShallow(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.a).toBe(inner);
  });

  it('配列をシャローコピーする', () => {
    const inner = [1, 2];
    const arr = [inner, 3];
    const clone = cloneShallow(arr);
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr);
    expect(clone[0]).toBe(inner);
  });

  it('Setをコピーする', () => {
    const set = new Set([1, 2, 3]);
    const clone = cloneShallow(set);
    expect(clone).toEqual(set);
    expect(clone).not.toBe(set);
  });

  it('Mapをコピーする', () => {
    const map = new Map([['a', 1]]);
    const clone = cloneShallow(map);
    expect(clone.get('a')).toBe(1);
    expect(clone).not.toBe(map);
  });

  it('Dateをコピーする', () => {
    const date = new Date('2024-06-01');
    const clone = cloneShallow(date);
    expect(clone.getTime()).toBe(date.getTime());
    expect(clone).not.toBe(date);
  });

  it('RegExpをコピーする', () => {
    const re = /abc/gi;
    const clone = cloneShallow(re);
    expect(clone.source).toBe(re.source);
    expect(clone.flags).toBe(re.flags);
    expect(clone).not.toBe(re);
  });

  it('ArrayBufferをコピーする', () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 42;
    const clone = cloneShallow(buffer);
    expect(clone).not.toBe(buffer);
    expect(clone.byteLength).toBe(8);
    expect(new Uint8Array(clone)[0]).toBe(42);
  });

  it('DataViewをコピーする', () => {
    const buffer = new ArrayBuffer(8);
    const dv = new DataView(buffer);
    dv.setInt32(0, 1234);
    const clone = cloneShallow(dv);
    expect(clone).not.toBe(dv);
    expect(clone.getInt32(0)).toBe(1234);
  });

  it('TypedArray(Uint8Array)をコピーする', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const clone = cloneShallow(arr);
    expect(clone).not.toBe(arr);
    expect(Array.from(clone)).toEqual([1, 2, 3]);
  });

  it('Symbolプロパティを持つオブジェクトをコピーする', () => {
    const sym = Symbol('key');
    const obj = { a: 1, [sym]: 'symbolValue' } as any;
    const clone = cloneShallow(obj);
    expect(clone[sym]).toBe('symbolValue');
    expect(clone.a).toBe(1);
    expect(clone).not.toBe(obj);
  });

  it('DataViewのbyteOffsetとbyteLengthを保つ', () => {
    const view = new DataView(new ArrayBuffer(8), 2, 4);
    const copy = cloneShallow(view);
    expect(copy).not.toBe(view);
    expect(copy.byteOffset).toBe(2);
    expect(copy.byteLength).toBe(4);
  });

  it('配列の空き要素と独自のプロパティを保つ', () => {
    const array: any = [1, 2, 3];
    delete array[1];
    array.extra = 'x';
    const copy = cloneShallow(array);
    expect(copy).not.toBe(array);
    expect(1 in copy).toBe(false);
    expect(copy.length).toBe(3);
    expect(copy.extra).toBe('x');
  });

  it('NaNを含む型付き配列をコピーする', () => {
    const array = new Float64Array([NaN, 1]);
    const copy = cloneShallow(array);
    expect(copy).not.toBe(array);
    expect(Array.from(copy)).toEqual([NaN, 1]);
  });

  it('SetとMapの独自のプロパティもコピーする', () => {
    const set: any = new Set([1]);
    set.extra = 'x';
    const map: any = new Map([[1, 2]]);
    map.extra = 'y';
    expect(cloneShallow(set).extra).toBe('x');
    expect(cloneShallow(map).extra).toBe('y');
  });

  it('未対応の型はそのまま返す', () => {
    const wm = new WeakMap();
    const result = cloneShallow(wm as any);
    expect(result).toBe(wm);
  });
});
