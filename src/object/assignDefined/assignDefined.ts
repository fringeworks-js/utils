import type { AssignDefinedResult } from '../assignDefinedMutable';
import { assignDefinedMutable } from '../assignDefinedMutable';
import type { AssignDefinedOptions } from './types';

/**
 * valuesにあるundefinedでない値のみtargetへ適用した新しいオブジェクトを返す（非破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param options オプション
 * @returns 値を適用した新しいオブジェクト
 */
export default function assignDefined<T extends object, V extends object>(
  target: T,
  values: V,
  options: AssignDefinedOptions = {},
): AssignDefinedResult<T, V> {
  return assignDefinedMutable({ ...target }, values, options);
}
