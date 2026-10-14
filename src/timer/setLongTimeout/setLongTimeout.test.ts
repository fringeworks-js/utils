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

  describe('signal', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('中断するとコールバックが呼ばれない', () => {
      const fn = vi.fn();
      const controller = new AbortController();
      setLongTimeout(fn, 100, { signal: controller.signal });
      controller.abort();
      vi.advanceTimersByTime(100);
      expect(fn).not.toHaveBeenCalled();
    });

    it('2^31-1を超える遅延時間でも中断できる', async () => {
      const fn = vi.fn();
      const controller = new AbortController();
      setLongTimeout(fn, 2 ** 31 + 1000, { signal: controller.signal });
      await vi.advanceTimersByTimeAsync(2 ** 31 - 1);
      controller.abort();
      await vi.advanceTimersByTimeAsync(2000);
      expect(fn).not.toHaveBeenCalled();
    });

    it('中断済みの signal の場合はタイマーを設定しない', () => {
      const fn = vi.fn();
      setLongTimeout(fn, 0, { signal: AbortSignal.abort() });
      vi.advanceTimersByTime(1);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('特殊な遅延時間', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([NaN, -100])('%s は0として扱う', (delay) => {
      const fn = vi.fn();
      setLongTimeout(fn, delay);
      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('Infinity の場合は実行しない', () => {
      const fn = vi.fn();
      setLongTimeout(fn, Infinity);
      vi.advanceTimersByTime(2 ** 31 * 4);
      expect(fn).not.toHaveBeenCalled();
    });
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

    it('時計が進んだ場合は目標の時刻に合わせて実行する', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      setLongTimeout(fn, MAX_DELAY * 2);

      // スリープなどでタイマーが止まっている間に時刻だけが進んだ状態
      vi.setSystemTime(Date.now() + MAX_DELAY);
      await vi.advanceTimersByTimeAsync(MAX_DELAY);
      expect(fn).toHaveBeenCalledTimes(1);

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
