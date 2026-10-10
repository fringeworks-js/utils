import type { MeasureOptions, MeasureResult } from './types';

/**
 * 関数を指定回数実行しかかった時間を測定する
 * 実行回数を指定しなかった場合は10回実行する
 * @param fn 測定対象の関数
 * @param options オプション
 * @returns
 */
export default function measure<A extends unknown[] = unknown[], R = unknown>(
  fn: (...args: A) => R,
  options: MeasureOptions<A> = {},
): MeasureResult<R> {
  const { iterations = 10, args = [] as A, getArgs = () => args } = options;
  // 指定回数分実行
  let returnValue;
  // 所要時間
  let time = 0;
  for (let i = 0; i < iterations; i++) {
    // 引数の取得
    const currentArgs = getArgs();
    // 計測
    const start = performance.now();
    returnValue = fn(...currentArgs);
    time += performance.now() - start;
  }

  return { time, returnValue };
}
