import type { FillDefaultsResult } from '../fillDefaultsMutable';
import { fillDefaultsMutable } from '../fillDefaultsMutable';
import type { FillDefaultsOptions } from './types';

/**
 * 対象のオブジェクトのプロパティ値がundefinedのとき、デフォルト値のプロパティ値がundefinedでなければ設定した新しいオブジェクトを返す（非破壊的変更）
 *
 * @param target 対象のオブジェクト
 * @param defaultValues デフォルト値
 * @param options オプション
 * @returns デフォルト値を設定した新しいオブジェクト
 */
export default function fillDefaults<T extends object, V extends object>(
  target: T,
  defaultValues: V,
  options: FillDefaultsOptions = {},
): FillDefaultsResult<T, V> {
  return fillDefaultsMutable({ ...target }, defaultValues, options);
}
