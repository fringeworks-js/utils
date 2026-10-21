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
export default function fillDefaults<
  T extends object,
  const V extends object,
  // オプションを指定しない場合（すべて省略）を表すため、空のオブジェクト型にする
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const O extends FillDefaultsOptions = {},
>(target: T, defaultValues: V, options?: O): FillDefaultsResult<T, V, O> {
  return fillDefaultsMutable({ ...target }, defaultValues, options);
}
