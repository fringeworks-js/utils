import type { LooseRecord } from '@fringeworks/types';
import isEqualBy from '../../compare/isEqualBy';
import type { UpdateMutableOptions } from './types';

/**
 * valuesに設定された値でobjectを更新する
 * 値の変更が無いキーは更新しない
 * @param object 更新対象のオブジェクト
 * @param values 更新する値を持ったオブジェクト
 * @param options オプション
 * @returns 更新されたキーと以前の値
 */
const updateMutable = <T extends LooseRecord>(
  object: T | null | undefined,
  values: Partial<T> | null | undefined,
  options?: UpdateMutableOptions,
): Partial<T> => _updateMutable(object, values, options);
updateMutable.dataLast =
  <T extends LooseRecord>(
    values: Partial<T> | null | undefined,
    options?: UpdateMutableOptions,
  ) =>
  (object: T | null | undefined): Partial<T> =>
    _updateMutable(object, values, options);
export default updateMutable;

function _updateMutable<T extends LooseRecord>(
  object: T | null | undefined,
  values: Partial<T> | null | undefined,
  options?: UpdateMutableOptions,
): Partial<T> {
  const oldValues: Partial<T> = {};
  if (object && values) {
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        const value = values[key];
        const oldValue = object[key];
        if (!isEqualBy(oldValue, value, options)) {
          object[key] = value;
          oldValues[key] = oldValue;
        }
      }
    }
  }
  return oldValues;
}
