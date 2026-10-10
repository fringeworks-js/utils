import * as R from 'remeda';
import { ensureArray } from '../../array/ensureArray';

/**
 * 指定したキーのプロパティを除いた新しいオブジェクトを返す
 * キーはパスとして解釈しない（ネストしたプロパティの削除には`unset`を使う）
 * @param data 対象のオブジェクト
 * @param keys 除外するキー。配列で複数指定できる
 * @returns 指定したキーを除いた新しいオブジェクト。dataがnull/undefinedの場合はundefined
 */
const omit = <T, R = unknown>(
  data: T,
  keys: PropertyKey | readonly PropertyKey[],
): R | undefined => _omit(data, keys);
omit.dataLast =
  <T, R = unknown>(keys: PropertyKey | readonly PropertyKey[]) =>
  (data: T): R | undefined =>
    _omit(data, keys);
export default omit;

function _omit<T, R = unknown>(
  data: T,
  keys: PropertyKey | readonly PropertyKey[],
): R | undefined {
  if (data == null) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return R.omit(data, ensureArray(keys as PropertyKey[]) as any[]) as R;
}
