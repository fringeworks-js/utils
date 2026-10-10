import setLongTimeout from './setLongTimeout';

describe('setLongTimeout', () => {
  it('通常の遅延時間でコールバックが呼ばれる', async () => {
    const fn = vi.fn();
    setLongTimeout(fn, 10);
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('キャンセル関数を返す', () => {
    const cancel = setLongTimeout(() => {}, 100);
    expect(typeof cancel).toBe('function');
    cancel();
  });

  it('キャンセルするとコールバックが呼ばれない', async () => {
    const fn = vi.fn();
    const cancel = setLongTimeout(fn, 50);
    cancel();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fn).not.toHaveBeenCalled();
  });

  describe('MAX_DELAYを超える遅延', () => {
    const MAX_DELAY = 2 ** 31 - 1;

    it('2^31-1を超える遅延時間でコールバックが呼ばれる', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      setLongTimeout(fn, MAX_DELAY + 1000);

      await vi.advanceTimersByTimeAsync(MAX_DELAY);
      expect(fn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1000);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('2^31-1を超える遅延時間でもキャンセルできる', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const cancel = setLongTimeout(fn, MAX_DELAY + 1000);
      cancel();

      await vi.advanceTimersByTimeAsync(MAX_DELAY + 1000);
      expect(fn).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('2^31-1 × 2を超える遅延時間でも正しく動作する', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      setLongTimeout(fn, MAX_DELAY * 2 + 1000);

      await vi.advanceTimersByTimeAsync(MAX_DELAY);
      expect(fn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(MAX_DELAY);
      expect(fn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1000);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });
});
