import type { SetLongTimeoutOptions } from './types';

// JavaScriptのsetTimeoutの最大値
const MAX_DELAY = 2 ** 31 - 1;

/**
 * JavaScriptのsetTimeoutの最大値（約24.8日）を超える遅延時間を設定できる関数。\
 * 最大値を超える場合は、目標の時刻までの残り時間を計算しながらタイマーを設定し直す。\
 * `NaN` や負の値は `setTimeout` と同じく0として扱い、`Infinity` の場合は実行しない
 * @param callback コールバック関数
 * @param delay 遅延時間（ミリ秒）
 * @param options オプション
 * @returns キャンセル用関数
 */
export default function setLongTimeout(
  callback: () => void,
  delay: number,
  options: SetLongTimeoutOptions = {},
): () => void {
  const { signal } = options;
  if (signal?.aborted) {
    return () => {};
  }

  let id: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    clearTimeout(id);
    signal?.removeEventListener('abort', cancel);
  };
  const run = () => {
    signal?.removeEventListener('abort', cancel);
    callback();
  };
  signal?.addEventListener('abort', cancel);

  if (!(delay > MAX_DELAY)) {
    // NaN もこちらに入り、setTimeout によって0として扱われる
    id = setTimeout(run, delay);
    return cancel;
  }

  const target = Date.now() + delay;
  const schedule = () => {
    const rest = target - Date.now();
    if (rest > 0) {
      id = setTimeout(schedule, Math.min(rest, MAX_DELAY));
    } else {
      run();
    }
  };
  if (delay !== Infinity) {
    schedule();
  }
  return cancel;
}
