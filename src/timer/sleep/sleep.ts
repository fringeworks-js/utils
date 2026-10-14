import { setLongTimeout } from '../setLongTimeout';
import type { SleepOptions } from './types';

/**
 * 指定した時間が経過すると resolve する Promise を返す。\
 * `setTimeout` の最大値（約24.8日）を超える時間も指定できる
 * @param ms 待つ時間（ミリ秒）
 * @param options オプション
 * @returns `ms` ミリ秒後に resolve する Promise。
 * 中断時は `signal.reason`（未設定の場合は `AbortError`）で reject する
 */
export default function sleep(
  ms: number,
  options: SleepOptions = {},
): Promise<void> {
  const { signal } = options;
  if (signal?.aborted) {
    return Promise.reject(getAbortReason(signal));
  }
  return new Promise((resolve, reject) => {
    // signal があるときだけ登録するので、signal は必ずある
    const onAbort = () => reject(getAbortReason(signal!));
    signal?.addEventListener('abort', onAbort, { once: true });
    setLongTimeout(
      () => {
        signal?.removeEventListener('abort', onAbort);
        resolve();
      },
      ms,
      { signal },
    );
  });
}

/**
 * 中断の理由を取得する
 * @param signal AbortSignal
 * @returns 中断の理由
 */
function getAbortReason(signal: AbortSignal): unknown {
  // reasonに対応していないブラウザ向けにAbortErrorを補う
  return signal.reason ?? new DOMException('Aborted.', 'AbortError');
}
