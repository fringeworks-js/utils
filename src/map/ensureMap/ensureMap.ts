import { isIterable } from '../../type/isIterable';
import type { EnsureMapOptions, EnsureMapSource } from './types';

/**
 * Mapであることを保証する\
 * 反復可能なオブジェクトはMapのコンストラクターと同じく`[キー, 値]`のエントリーとして、
 * それ以外のオブジェクトはプロパティをエントリーとして変換する
 * @param data 変換する値。null・undefinedは空のMapになる
 * @param options オプション
 * @returns Mapに変換された値
 */
function ensureMap<K, V>(
  data: Iterable<readonly [K, V]> | null | undefined,
  options?: EnsureMapOptions,
): Map<K, V>;
function ensureMap<V>(
  data: Record<string, V> | null | undefined,
  options?: EnsureMapOptions,
): Map<string, V>;
function ensureMap<K, V>(
  data: EnsureMapSource<K, V> | null | undefined,
  options?: EnsureMapOptions,
): Map<K | string, V>;
function ensureMap(
  data: EnsureMapSource<unknown, unknown> | null | undefined,
  options?: EnsureMapOptions,
): Map<unknown, unknown> {
  return _ensureMap(data, options);
}

export default ensureMap;

function _ensureMap(
  data: unknown,
  options: EnsureMapOptions = {},
): Map<unknown, unknown> {
  if (data instanceof Map) {
    return options.raw ? data : new Map(data);
  } else if (data == null || typeof data !== 'object') {
    return new Map();
  } else if (isIterable(data)) {
    // 要素がエントリーの形かどうかは Map のコンストラクターに任せる
    return new Map(data as Iterable<readonly [unknown, unknown]>);
  }
  return new Map(Object.entries(data));
}
