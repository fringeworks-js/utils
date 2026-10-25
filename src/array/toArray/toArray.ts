import { isIterable } from '../../type/isIterable';
import type { ToArrayOptions } from './types';

/**
 * 対象を配列として見なして変換する。
 * 文字列以外のIterableなオブジェクトは展開し、それ以外は配列で包む。
 * 配列は複製して返す。`raw: true`の場合は複製せずにそのまま返すため、戻り値は`readonly`の配列になる
 */
function toArray<T>(
  data: unknown,
  options: ToArrayOptions & { raw: true },
): readonly T[];
function toArray<T>(
  data: unknown,
  options?: ToArrayOptions & { raw?: false },
): T[];
function toArray<T>(data: unknown, options?: ToArrayOptions): readonly T[];
function toArray<T>(data: unknown, options: ToArrayOptions = {}): readonly T[] {
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

export default toArray;
