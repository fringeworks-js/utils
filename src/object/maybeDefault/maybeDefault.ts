import type { LooseRecord } from '@fringeworks/types';
import maybeDefaultMutable from '../maybeDefaultMutable';
import type { MaybeDefaultOptions } from './types';

/**
 * 対象のオブジェクトのプロパティ値がundefinedのとき、デフォルト値のプロパティ値がundefinedでなければ設定する。
 *
 * @param target 対象のオブジェクト
 * @param defaultValues デフォルト値
 * @param options オプション
 * @returns デフォルト値が設定されたオブジェクト
 */
const maybeDefault = <T extends LooseRecord, V extends LooseRecord>(
  target: T,
  defaultValues: V,
  options: MaybeDefaultOptions = {},
): T & V => _maybeDefault(target, defaultValues, options);
maybeDefault.dataLast =
  <V extends LooseRecord>(
    defaultValues: V,
    options: MaybeDefaultOptions = {},
  ) =>
  <T extends LooseRecord>(target: T): T & V =>
    _maybeDefault(target, defaultValues, options);
export default maybeDefault;

function _maybeDefault<T extends LooseRecord, V extends LooseRecord>(
  target: T,
  defaultValues: V,
  options: MaybeDefaultOptions = {},
): T & V {
  if (target && defaultValues) {
    return maybeDefaultMutable({ ...target }, defaultValues, options);
  }
  return target as T & V;
}
