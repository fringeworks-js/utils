import type { LooseRecord } from '@fringeworks/types';
import { isEqual } from '../../compare/isEqual';
import type { UpdateOptions } from './types';

/**
 * valuesに設定された値でobjectを更新した新しいオブジェクトを返す（非破壊的変更）
 * 値の変更が無いキーは更新しない。全てのキーに変更が無い場合はobjectをそのまま返す
 * @param object 更新対象のオブジェクト
 * @param values 更新する値を持ったオブジェクト
 * @param options オプション
 * @returns 更新された新しいオブジェクト
 */
const update = <T extends LooseRecord>(
  object: T,
  values: Partial<T>,
  options?: UpdateOptions,
): T => _update(object, values, options);
update.dataLast =
  (values: LooseRecord, options?: UpdateOptions) =>
  <T extends LooseRecord>(object: T): T =>
    _update(object, values as Partial<T>, options);
export default update;

function _update<T extends LooseRecord>(
  object: T,
  values: Partial<T>,
  options?: UpdateOptions,
): T {
  if (!object || !values) {
    return object;
  }
  let result: T | undefined;
  for (const key in values) {
    if (Object.hasOwn(values, key)) {
      const value = values[key];
      if (!isEqual(object[key], value, options)) {
        // 初めて変更があった時点で複製する
        result ??= { ...object };
        result[key] = value;
      }
    }
  }
  return result ?? object;
}
