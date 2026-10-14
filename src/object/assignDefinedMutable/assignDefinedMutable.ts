import type { StrictRecord } from '@fringeworks/types';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { forEachValue } from '../forEachValue';
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
  const { skipNull, ...opts } = options;
  const isValidValue = skipNull
    ? (value: unknown) => value != null
    : (value: unknown) => value !== undefined;
  const record = target as StrictRecord;
  forEachValue(
    values,
    (value, key) => {
      if (!_isUnsafeKey(key) && isValidValue(value)) {
        record[key] = value;
      }
    },
    opts,
  );
  return target as AssignDefinedResult<T, V>;
}
