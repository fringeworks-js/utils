import type { EnsureMapOptions, EnsureMapSource } from './types';

/**
 * Mapであることを保証する\
 * @param data 変換する値
 * @param options オプション
 * @returns Mapに変換された値
 */
const ensureMap = <K, V>(
  data: EnsureMapSource<K, V> | null | undefined,
  options?: EnsureMapOptions,
): Map<K, V> => _ensureMap(data, options);
ensureMap.dataLast = (options: EnsureMapOptions = {}) => {
  return <K, V>(data: EnsureMapSource<K, V> | null | undefined): Map<K, V> =>
    _ensureMap(data, options);
};
export default ensureMap;

/**
 * 与えられた値を Map インスタンスに変換します。
 * - Map: そのままコピーを返す
 * - Object: プロパティをエントリーとして変換
 * - Array: [key, value] のペアの配列、またはインデックスをキーとした Map
 */
function _ensureMap<K, V>(
  data: EnsureMapSource<K, V> | null | undefined,
  options: EnsureMapOptions = {},
): Map<K, V> {
  if (data == null) {
    return new Map();
  } else if (data instanceof Map) {
    return options.raw ? data : new Map(data);
  } else if (Array.isArray(data)) {
    //  配列の場合
    // 要素が [key, value] のタプル形式かチェック
    const isEntryArray =
      data.length > 0 && Array.isArray(data[0]) && data[0].length === 2;
    if (isEntryArray) {
      return new Map(data as Array<[K, V]>);
    } else {
      // 単なる値の配列なら、インデックスをキーにする
      return new Map(data.map((value, index) => [index, value] as [K, V]));
    }
  } else if (typeof data === 'object') {
    // オブジェクトの場合
    return new Map(Object.entries(data) as unknown as Array<[K, V]>);
  }
  // それ以外
  return new Map();
}
