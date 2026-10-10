import type { CompactMapIteratee, CompactMapOptions } from './types';

const IS_TARGET = {
  undefined: <T>(value: T): value is T => value !== undefined,
  nullish: <T>(value: T): value is T => value != null,
  empty: <T>(value: T): value is T => value != null && value !== '',
  falsy: <T>(value: T): value is T => !!value,
};

/**
 * callbackの戻り値がundefined以外のものだけで構成された配列を返す
 * @param data
 * @param callback
 * @returns
 */
const compactMap = <V, R = V>(
  data: V[] | null | undefined,
  callback: CompactMapIteratee<V, R>,
  options?: CompactMapOptions,
): R[] | null | undefined => _compactMap(data, callback, options);
compactMap.dataLast =
  <V, R = V>(callback: CompactMapIteratee<V, R>, options?: CompactMapOptions) =>
  (data: V[] | null | undefined) =>
    compactMap(data, callback, options);
export default compactMap;

function _compactMap<V, R = V>(
  data: V[] | null | undefined,
  callback: CompactMapIteratee<V, R>,
  options: CompactMapOptions = {},
): R[] | null | undefined {
  if (data) {
    const isTarget = IS_TARGET[options.exclude || 'undefined'];
    const result: R[] = [];
    const length = data.length;
    for (let i = 0; i < length; i++) {
      const mapped = callback(data[i], i, data);
      if (isTarget(mapped)) {
        result.push(mapped);
      }
    }
    return result;
  }
  return undefined;
}
