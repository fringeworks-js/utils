import type { StrictRecord } from '@fringeworks/types';
import * as R from 'remeda';

/**
 * 指定したキーのプロパティを除いた新しいオブジェクトを返す
 * キーはパスとして解釈しない（ネストしたプロパティの削除には`unset`を使う）
 * @param data 対象のオブジェクト
 * @param keys 除外するキー。配列で複数指定できる。data に無いキーも指定できる
 * @returns 指定したキーを除いた新しいオブジェクト。dataがnull/undefinedの場合はundefined
 */
function omit<T extends object, K extends PropertyKey>(
  data: T,
  keys: K | readonly K[],
): Omit<T, K>;
function omit<T extends object, K extends PropertyKey>(
  data: T | null | undefined,
  keys: K | readonly K[],
): Omit<T, K> | undefined;
function omit(
  data: object | null | undefined,
  keys: PropertyKey | readonly PropertyKey[],
): object | undefined {
  if (data == null) {
    return undefined;
  }
  return R.omit(data as StrictRecord, R.isArray(keys) ? keys : [keys]);
}

export default omit;
