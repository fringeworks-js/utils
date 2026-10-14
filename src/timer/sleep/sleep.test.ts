import sleep from './sleep';

describe('sleep', () => {
  it('指定時間後にresolveする', async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40);
  });

  it('Promiseを返す', () => {
    const result = sleep(0);
    expect(result).toBeInstanceOf(Promise);
  });

  it('0ms でも動作する', async () => {
    await expect(sleep(0)).resolves.toBeUndefined();
  });

  it('setTimeout の最大値を超える時間も待つ', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    sleep(2 ** 31).then(fn);

    await vi.advanceTimersByTimeAsync(2 ** 31 - 1);
    expect(fn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  describe('signal', () => {
    it('中断すると signal.reason で reject する', async () => {
      const controller = new AbortController();
      const promise = sleep(1000, { signal: controller.signal });
      const reason = new Error('stop');
      controller.abort(reason);
      await expect(promise).rejects.toBe(reason);
    });

    it('中断済みの signal の場合はすぐに reject する', async () => {
      await expect(
        sleep(1000, { signal: AbortSignal.abort() }),
      ).rejects.toMatchObject({ name: 'AbortError' });
    });

    it('中断しなければ resolve する', async () => {
      const controller = new AbortController();
      await expect(
        sleep(0, { signal: controller.signal }),
      ).resolves.toBeUndefined();
    });
  });
});
