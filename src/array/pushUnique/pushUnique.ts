import { pushUniqueMutable } from '../pushUniqueMutable';
import type { PushUniqueOptions } from './types';

/**
 * 同じ要素が配列に存在しない場合のみ追加先の新しい配列に要素を追加する。
 * @param data 追加先の配列
 * @param items 追加する要素
 * @param options オプション
 */
const pushUnique = <T>(
  data: T[] | null | undefined,
  items: T[] | null | undefined,
  options?: PushUniqueOptions<T>,
) => _pushUnique(data, items, options);
pushUnique.dataLast =
  <T>(items: T[] | null | undefined, options?: PushUniqueOptions<T>) =>
  (data: T[] | null | undefined) =>
    _pushUnique(data, items, options);
export default pushUnique;

function _pushUnique<T>(
  data: T[] | null | undefined,
  items: T[] | null | undefined,
  options: PushUniqueOptions<T> = {},
): T[] | null | undefined {
  if (data) {
    return pushUniqueMutable([...data], items, options);
  }
  return data;
}
