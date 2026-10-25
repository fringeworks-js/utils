import type { StrictRecord } from '@fringeworks/types';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { forEachValue } from '../forEachValue';
import type { UpdateOptions } from './types';

/**
 * valuesに設定された値でobjectを更新した新しいオブジェクトを返す（非破壊的変更）
 * 値の変更が無いキーは更新しない。全てのキーに変更が無い場合はobjectをそのまま返す
 * @param target 更新対象のオブジェクト
 * @param values 更新する値を持ったオブジェクト
 * @param options オプション
 * @returns 更新された新しいオブジェクト
 */
export default function update<T extends object>(
  target: T,
  values: Partial<T>,
  options?: UpdateOptions,
): T {
  const isEqual = options?.isEqual ?? Object.is;
  const record = target as StrictRecord;
  let result: StrictRecord | undefined;
  forEachValue(values, (value, key) => {
    if (!_isUnsafeKey(key) && !isEqual(record[key], value)) {
      // 初めて変更があった時点で複製する
      result ??= { ...record };
      result[key] = value;
    }
  });
  return (result as T | undefined) ?? target;
}
