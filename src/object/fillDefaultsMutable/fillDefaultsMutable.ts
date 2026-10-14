import type { StrictRecord } from '@fringeworks/types';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { forEachValue } from '../forEachValue';
import type { FillDefaultsMutableOptions, FillDefaultsResult } from './types';

/**
 * 対象のオブジェクトのプロパティ値がundefinedのとき、デフォルト値のプロパティ値がundefinedでなければ設定する（破壊的変更）
 *
 * @param target 対象のオブジェクト
 * @param defaultValues デフォルト値
 * @param options オプション
 * @returns デフォルト値を設定した同じオブジェクト
 */
export default function fillDefaultsMutable<T extends object, V extends object>(
  target: T,
  defaultValues: V,
  options: FillDefaultsMutableOptions = {},
): FillDefaultsResult<T, V> {
  const { skipNull, overwriteNull, ...opts } = options;
  const isValidValue = skipNull
    ? (value: unknown) => value != null
    : (value: unknown) => value !== undefined;
  const isOverwritable = overwriteNull
    ? (value: unknown) => value == null
    : (value: unknown) => value === undefined;
  const record = target as StrictRecord;
  forEachValue(
    defaultValues,
    (value, key) => {
      if (
        !_isUnsafeKey(key) &&
        isValidValue(value) &&
        isOverwritable(record[key])
      ) {
        record[key] = value;
      }
    },
    opts,
  );
  return target as FillDefaultsResult<T, V>;
}
