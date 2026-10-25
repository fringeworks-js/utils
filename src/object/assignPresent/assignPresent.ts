import type { AssignPresentResult } from '../assignPresentMutable';
import { assignPresentMutable } from '../assignPresentMutable';
import type { AssignPresentOptions } from './types';

/**
 * valuesにあるnull・undefinedでない値のみtargetへ適用した新しいオブジェクトを返す（非破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param options オプション
 * @returns 値を適用した新しいオブジェクト
 */
export default function assignPresent<T extends object, V extends object>(
  target: T,
  values: V,
  options: AssignPresentOptions = {},
): AssignPresentResult<T, V> {
  return assignPresentMutable({ ...target }, values, options);
}
