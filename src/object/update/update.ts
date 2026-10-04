import type { LooseRecord } from '@fringeworks/types';
import updateMutable from '../updateMutable';
import type { UpdateOptions } from './types';

/**
 * valuesに設定された値でobjectを更新する
 * 値の変更が無いキーは更新しない
 * @param object 更新対象のオブジェクト
 * @param values 更新する値を持ったオブジェクト
 * @param options オプション
 * @returns 更新されたキーと以前の値
 */
const update = <T extends LooseRecord>(
  object: T,
  values: Partial<T>,
  options?: UpdateOptions,
): Partial<T> => _update(object, values, options);
update.dataLast =
  (values: LooseRecord, options?: UpdateOptions) =>
  <T extends LooseRecord>(object: T): Partial<T> =>
    _update(object, values as Partial<T>, options);
export default update;

function _update<T extends LooseRecord>(
  object: T,
  values: Partial<T>,
  options?: UpdateOptions,
): Partial<T> {
  if (object && values) {
    return updateMutable({ ...object }, values, options);
  }
  return {};
}
