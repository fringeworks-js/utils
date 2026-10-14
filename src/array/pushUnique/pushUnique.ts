import { pushUniqueMutable } from '../pushUniqueMutable';
import type { PushUniqueOptions } from './types';

/**
 * 同じ要素が配列に存在しない場合のみ追加先の新しい配列に要素を追加する。
 * @param data 追加先の配列。null・undefinedは空配列として扱う
 * @param items 追加する要素。null・undefinedは空配列として扱う
 * @param options オプション
 */
export default function pushUnique<T>(
  data: T[] | null | undefined,
  items: T[] | null | undefined,
  options: PushUniqueOptions<T> = {},
): T[] {
  return pushUniqueMutable(data ? [...data] : [], items, options);
}
