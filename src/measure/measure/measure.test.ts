import measure from './measure';

describe('measure', () => {
  it('デフォルトで10回実行しtimeとreturnValueを返す', () => {
    const fn = vi.fn(() => 42);
    const result = measure(fn);
    expect(fn).toHaveBeenCalledTimes(10);
    expect(result.returnValue).toBe(42);
    expect(result.time).toBeGreaterThanOrEqual(0);
  });

  it('iterationで実行回数を指定できる', () => {
    const fn = vi.fn(() => 'hello');
    const result = measure(fn, { iteration: 5 });
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
    measure(fn, { iteration: 3, getArgs: () => [count++] as [number] });
    expect(fn).toHaveBeenNthCalledWith(1, 0);
    expect(fn).toHaveBeenNthCalledWith(2, 1);
    expect(fn).toHaveBeenNthCalledWith(3, 2);
  });
});
