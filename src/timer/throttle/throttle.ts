import * as R from 'remeda';
import type { ThrottleOptions, ThrottleResult } from './types';

/**
 * 対象の関数を、`wait`（既定値 240）ミリ秒に1回までしか実行されないようにした関数を作成する。\
 * `fn` には最後の呼び出しの引数が渡される
 * @param fn 対象の関数
 * @param options オプション
 * @returns throttle した関数
 */
export default function throttle<ARGS extends unknown[]>(
  fn: (...args: ARGS) => void,
  options: ThrottleOptions = {},
): ThrottleResult<ARGS> {
  const { wait = 240, triggerAt = 'both' } = options;
  const reducer = (_: ARGS | undefined, ...args: ARGS) => args;
  const throttledFn =
    triggerAt === 'end'
      ? // 最初の呼び出しから wait 後に実行する
        R.funnel((args: ARGS) => fn(...args), {
          reducer,
          triggerAt,
          minQuietPeriodMs: wait,
          maxBurstDurationMs: wait,
        })
      : // 実行から次の実行までの間隔を wait 以上空ける
        R.funnel((args: ARGS) => fn(...args), {
          reducer,
          triggerAt,
          minGapMs: wait,
        });

  return Object.assign((...args: ARGS) => throttledFn.call(...args), {
    cancel: () => throttledFn.cancel(),
    flush: () => throttledFn.flush(),
    isIdle: () => throttledFn.isIdle,
  });
}
