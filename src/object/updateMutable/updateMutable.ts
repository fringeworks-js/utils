import type { StrictRecord } from '@fringeworks/types';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { forEachValue } from '../forEachValue';
import type { UpdateMutableOptions } from './types';

/**
 * valuesに設定された値でobjectを更新する
 * 値の変更が無いキーは更新しない
 * @param object 更新対象のオブジェクト
 * @param values 更新する値を持ったオブジェクト
 * @param options オプション
 * @returns 更新されたキーと以前の値
 */
export default function updateMutable<T extends object>(
  object: T,
  values: Partial<T>,
  options?: UpdateMutableOptions,
): Partial<T> {
  const isEqual = options?.isEqual ?? Object.is;
  const record = object as StrictRecord;
  const oldValues: StrictRecord = {};
  forEachValue(values, (value, key) => {
    if (_isUnsafeKey(key)) {
      return;
    }
    const oldValue = record[key];
    if (!isEqual(oldValue, value)) {
      record[key] = value;
      oldValues[key] = oldValue;
    }
  });
  return oldValues as Partial<T>;
}
