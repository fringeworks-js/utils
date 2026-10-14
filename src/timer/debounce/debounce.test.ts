import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import debounce from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('基本動作', () => {
    it('waitミリ秒後に関数が呼ばれる', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('a');
    });

    it('wait未満の間隔で複数回呼ばれた場合、最後の呼び出しの引数で1回だけ実行される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      vi.advanceTimersByTime(50);
      debouncedFn('b');
      vi.advanceTimersByTime(50);
      debouncedFn('c');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('c');
    });

    it('wait以上の間隔が空いた場合、それぞれ実行される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      vi.advanceTimersByTime(100);

      debouncedFn('b');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, 'a');
      expect(fn).toHaveBeenNthCalledWith(2, 'b');
    });
  });

  describe('triggerAt オプション', () => {
    it('triggerAt: "end"（デフォルト）はwait後に実行される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100, triggerAt: 'end' });

      debouncedFn('a');
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('triggerAt: "start" は最初の呼び出しで即時実行される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100, triggerAt: 'start' });

      debouncedFn('a');
      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('a');

      // wait中は再実行されない
      debouncedFn('b');
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('triggerAt: "both" は最初と最後の両方で実行される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100, triggerAt: 'both' });

      debouncedFn('a');
      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('a');

      debouncedFn('b');
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith('b');
    });
  });

  describe('cancel', () => {
    it('cancel後は関数が実行されない', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      debouncedFn.cancel();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('flush', () => {
    it('flush後は即時実行される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      expect(fn).not.toHaveBeenCalled();

      debouncedFn.flush();
      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith('a');
    });

    it('保留中の呼び出しがない場合、flushは何もしない', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn.flush();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('isIdle', () => {
    it('初期状態はtrue', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      expect(debouncedFn.isIdle()).toBe(true);
    });

    it('呼び出し中はfalse', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      expect(debouncedFn.isIdle()).toBe(false);
    });

    it('wait後はtrue', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a');
      vi.advanceTimersByTime(100);
      expect(debouncedFn.isIdle()).toBe(true);
    });
  });

  describe('複数引数', () => {
    it('複数の引数が正しく渡される', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, { wait: 100 });

      debouncedFn('a', 'b', 'c');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
    });
  });

  describe('wait', () => {
    it('省略した場合は240ms', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn);

      debouncedFn('a');
      vi.advanceTimersByTime(239);
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledOnce();
    });
  });
});
