import type { LooseRecord } from '@fringeworks/types';
import type { FillDefaultsResult } from '../fillDefaultsMutable';
import { fillDefaultsMutable } from '../fillDefaultsMutable';
import type { FillDefaultsOptions } from './types';

/**
 * 対象のオブジェクトのプロパティ値がundefinedのとき、デフォルト値のプロパティ値がundefinedでなければ設定する。
 *
 * @param target 対象のオブジェクト
 * @param defaultValues デフォルト値
 * @param options オプション
 * @returns デフォルト値が設定されたオブジェクト
 */
const fillDefaults = <T extends LooseRecord, V extends LooseRecord>(
  target: T,
  defaultValues: V,
  options: FillDefaultsOptions = {},
): FillDefaultsResult<T, V> => _fillDefaults(target, defaultValues, options);
fillDefaults.dataLast =
  <V extends LooseRecord>(
    defaultValues: V,
    options: FillDefaultsOptions = {},
  ) =>
  <T extends LooseRecord>(target: T): FillDefaultsResult<T, V> =>
    _fillDefaults(target, defaultValues, options);
export default fillDefaults;

function _fillDefaults<T extends LooseRecord, V extends LooseRecord>(
  target: T,
  defaultValues: V,
  options: FillDefaultsOptions = {},
): FillDefaultsResult<T, V> {
  if (target && defaultValues) {
    return fillDefaultsMutable({ ...target }, defaultValues, options);
  }
  return target as FillDefaultsResult<T, V>;
}
