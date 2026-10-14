/**
 * get のオプション
 */
export type GetOptions = {
  /**
   * プロトタイプ上のプロパティ（クラスの getter など）も辿るかどうか
   * @default false
   */
  includeInherited?: boolean;
};
