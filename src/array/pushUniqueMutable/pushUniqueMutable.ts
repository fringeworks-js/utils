import type { PushUniqueMutableOptions } from './types';

/**
 * 同じ要素が配列に存在しない場合のみ追加先の配列に要素を追加する。
 * @param data 追加先の配列
 * @param items 追加する要素。null・undefinedは空配列として扱う
 * @param options オプション
 */
export default function pushUniqueMutable<T>(
  data: T[],
  items: T[] | null | undefined,
  options: PushUniqueMutableOptions<T> = {},
): T[] {
  if (items) {
    const { threshold = 100, comparator } = options;

    if (comparator) {
      // comparator指定時は常に線形探索
      for (const item of items) {
        if (!data.some((existing) => comparator(existing, item))) {
          data.push(item);
        }
      }
    } else if (data.length + items.length < threshold) {
      for (const item of items) {
        if (!data.includes(item)) {
          data.push(item);
        }
      }
    } else {
      const existingSet = new Set(data);
      for (const item of items) {
        if (existingSet.has(item)) {
          continue;
        }
        existingSet.add(item);
        data.push(item);
      }
    }
  }
  return data;
}
