import _assignValues from '../../_internal/_assignValues';
import type { AssignDefinedMutableOptions, AssignDefinedResult } from './types';

/**
 * valuesにあるundefinedでない値のみtargetへ適用する（破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param options オプション
 * @returns 値を適用した同じオブジェクト
 */
export default function assignDefinedMutable<
  T extends object,
  V extends object,
>(
  target: T,
  values: V,
  options: AssignDefinedMutableOptions = {},
): AssignDefinedResult<T, V> {
  _assignValues(target, values, (value) => value !== undefined, options);
  return target as AssignDefinedResult<T, V>;
}
