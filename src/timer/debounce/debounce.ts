import * as R from 'remeda';
import type { DebounceOptions, DebounceResult } from './types';

/**
 * 対象の関数を、呼び出しが `wait`（既定値 240）ミリ秒途切れたときに実行する関数を作成する。\
 * `fn` には最後の呼び出しの引数が渡される
 * @param fn 対象の関数
 * @param options オプション
 * @returns debounce した関数
 */
export default function debounce<ARGS extends unknown[]>(
  fn: (...args: ARGS) => void,
  options: DebounceOptions = {},
): DebounceResult<ARGS> {
  const { wait = 240, triggerAt = 'end' } = options;
  const debouncedFn = R.funnel((args: ARGS) => fn(...args), {
    reducer: (_, ...args: ARGS) => args,
    minQuietPeriodMs: wait,
    // funnel の型は triggerAt の値ごとに分かれているため、'end' とそれ以外で分ける
    ...(triggerAt === 'end' ? { triggerAt } : { triggerAt }),
  });

  return Object.assign((...args: ARGS) => debouncedFn.call(...args), {
    cancel: () => debouncedFn.cancel(),
    flush: () => debouncedFn.flush(),
    isIdle: () => debouncedFn.isIdle,
  });
}
