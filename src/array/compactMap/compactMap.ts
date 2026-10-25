import type { IndexedIteratee } from '@fringeworks/types';
import type { CompactMapOptions } from './types';

const IS_TARGET = {
  undefined: <T>(value: T): value is T => value !== undefined,
  nullish: <T>(value: T): value is T => value != null,
  empty: <T>(value: T): value is T => value != null && value !== '',
  falsy: <T>(value: T): value is T => !!value,
};

/**
 * 各要素をcallbackで変換し、optionsのexcludeで指定した値を除いた配列を返す
 * @param data 配列。null・undefinedは空配列として扱う
 * @param callback 変換する関数
 * @param options オプション
 * @returns 変換した値の配列
 */
export default function compactMap<V, R = V>(
  data: readonly V[] | null | undefined,
  callback: IndexedIteratee<V, R>,
  options: CompactMapOptions = {},
): R[] {
  const result: R[] = [];
  if (!data) {
    return result;
  }
  const isTarget = IS_TARGET[options.exclude || 'undefined'];
  for (const [i, item] of data.entries()) {
    const mapped = callback(item, i, data);
    if (isTarget(mapped)) {
      result.push(mapped);
    }
  }
  return result;
}
