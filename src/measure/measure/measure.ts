import _createArgsList from '../_internal/_createArgsList';
import _run from '../_internal/_run';
import _toCount from '../_internal/_toCount';
import type { MeasureOptions, MeasureResult } from './types';

/**
 * 関数を指定回数実行し、全体にかかった時間を測定する\
 * 実行回数を指定しなかった場合は10回実行する
 * @param fn 測定対象の関数
 * @param options オプション。引数が必須の関数では、argsかgetArgsの指定が必須
 * @returns 所要時間と最後の戻り値
 */
export default function measure<R>(
  fn: () => R,
  options?: MeasureOptions<[]>,
): MeasureResult<R>;
export default function measure<A extends unknown[], R>(
  fn: (...args: A) => R,
  options: MeasureOptions<A>,
): MeasureResult<R>;
export default function measure<A extends unknown[], R>(
  fn: (...args: A) => R,
  options: MeasureOptions<A> = {} as MeasureOptions<A>,
): MeasureResult<R> {
  const iterations = _toCount(options.iterations, 10);
  return _run(fn, _createArgsList(options, iterations));
}
