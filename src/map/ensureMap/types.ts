export type EnsureMapOptions = {
  /**
   * valueがMapの時、そのまま返却するか。
   * デフォルトはfalseで、Mapのコピーを返却する。
   * trueの場合、戻り値は`ReadonlyMap`になる。
   * @default false
   */
  raw?: boolean;
};

/**
 * ensureMapが受け取る値
 * - `[キー, 値]` を返す反復可能なオブジェクト（Map、エントリーの配列など）
 * - プロパティをエントリーにするオブジェクト
 */
export type EnsureMapSource<K, V> =
  Iterable<readonly [K, V]> | Record<string, V>;
