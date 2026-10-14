import { isIterable } from '../../type/isIterable';
import type { ToArrayOptions } from './types';

/**
 * 対象を配列として見なして変換する。
 * 文字列以外のIterableなオブジェクトは展開し、それ以外は配列で包む。
 */
export default function toArray<T>(
  data: unknown,
  options: ToArrayOptions = {},
): T[] {
  if (data == null) {
    return [];
  } else if (Array.isArray(data)) {
    return options.raw ? data : [...data];
  } else if (typeof data === 'string') {
    return [data as unknown as T];
  } else if (isIterable(data)) {
    return Array.from(data) as T[];
  }

  return [data as T];
}
