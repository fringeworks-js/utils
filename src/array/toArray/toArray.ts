import { isIterable } from '../../type/isIterable';
import type { ToArrayOptions } from './types';

/**
 * 対象を配列として見なして変換する。
 * 文字列以外のIterableなオブジェクトは展開し、それ以外は配列で包む。
 */
const toArray = <T>(data: unknown, options: ToArrayOptions = {}): T[] =>
  _toArray(data, options);
toArray.dataLast =
  (options: ToArrayOptions = {}) =>
  <T>(data: unknown): T[] =>
    _toArray(data, options);
export default toArray;

function _toArray<T>(data: unknown, options: ToArrayOptions = {}): T[] {
  if (data == null) {
    return [];
  } else if (Array.isArray(data)) {
    return options.raw ? data : [...data];
  } else if (typeof data === 'string') {
    return [data as unknown as T];
  } else if (isIterable<T>(data)) {
    return Array.from(data);
  }

  return [data as T];
}
