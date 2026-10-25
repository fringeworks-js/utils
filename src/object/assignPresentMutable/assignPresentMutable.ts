import _assignValues from '../../_internal/_assignValues';
import type { AssignPresentMutableOptions, AssignPresentResult } from './types';

/**
 * valuesにあるnull・undefinedでない値のみtargetへ適用する（破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param options オプション
 * @returns 値を適用した同じオブジェクト
 */
export default function assignPresentMutable<
  T extends object,
  V extends object,
>(
  target: T,
  values: V,
  options: AssignPresentMutableOptions = {},
): AssignPresentResult<T, V> {
  _assignValues(target, values, (value) => value != null, options);
  return target as AssignPresentResult<T, V>;
}
