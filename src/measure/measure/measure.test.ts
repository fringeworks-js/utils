import measure from './measure';

describe('measure', () => {
  it('デフォルトで10回実行しtimeとreturnValueを返す', () => {
    const fn = vi.fn(() => 42);
    const result = measure(fn);
    expect(fn).toHaveBeenCalledTimes(10);
    expect(result.returnValue).toBe(42);
    expect(result.time).toBeGreaterThanOrEqual(0);
  });

  it('iterationsで実行回数を指定できる', () => {
    const fn = vi.fn(() => 'hello');
    const result = measure(fn, { iterations: 5 });
    expect(fn).toHaveBeenCalledTimes(5);
    expect(result.returnValue).toBe('hello');
  });

  it('argsで引数を渡せる', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const result = measure(fn, { args: [3, 4] });
    expect(result.returnValue).toBe(7);
  });

  it('getArgsで毎回異なる引数を渡せる', () => {
    let count = 0;
    const fn = vi.fn((n: number) => n);
    measure(fn, { iterations: 3, getArgs: () => [count++] as [number] });
    expect(fn).toHaveBeenNthCalledWith(1, 0);
    expect(fn).toHaveBeenNthCalledWith(2, 1);
    expect(fn).toHaveBeenNthCalledWith(3, 2);
  });

  it('getArgsは計測の前に実行回数分呼ばれる', () => {
    const calls: string[] = [];
    const fn = (n: number) => calls.push(`fn${n}`);
    let count = 0;
    measure(fn, {
      iterations: 2,
      getArgs: () => {
        calls.push(`getArgs${count}`);
        return [count++] as [number];
      },
    });
    expect(calls).toEqual(['getArgs0', 'getArgs1', 'fn0', 'fn1']);
  });

  it('iterationsが1未満の場合は1回、無効な値の場合は10回実行する', () => {
    const fn = vi.fn(() => 0);
    measure(fn, { iterations: 0 });
    expect(fn).toHaveBeenCalledTimes(1);
    fn.mockClear();
    measure(fn, { iterations: 2.9 });
    expect(fn).toHaveBeenCalledTimes(2);
    fn.mockClear();
    measure(fn, { iterations: NaN });
    expect(fn).toHaveBeenCalledTimes(10);
  });

  it('型: 引数が必須の関数ではargsかgetArgsが必須', () => {
    const fn = (a: number) => a;
    // @ts-expect-error argsもgetArgsも無い
    measure(fn, {});
    measure(fn, { args: [1] });
    measure(fn, { getArgs: () => [1] });
    expectTypeOf(measure(() => 1).returnValue).toEqualTypeOf<number>();
  });
});
