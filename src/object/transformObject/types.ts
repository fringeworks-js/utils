/**
 * マッピングの定義
 */
export type TransformObjectRule<S extends object, T extends object> = {
  /**
   * 取得元のパス（文字列）または値を抽出する関数
   */
  from: string | ((source: S) => unknown);

  /**
   * 設定先のパス（文字列）または値を設定する関数。省略時は from と同じパス
   */
  to?: string | ((target: T, value: unknown) => T);

  /**
   * 抽出後に元のオブジェクト（source）から削除するかどうか（sourceを直接変更する）
   * 未指定の場合はオプションのremoveFromSourceに従う
   */
  removeFromSource?: boolean;
};

/**
 * オプション設定
 */
export type TransformObjectOptions = {
  /**
   * 文字列でパスを指定したルールについて、抽出後に元のオブジェクト（source）から削除するか（sourceを直接変更する）
   * ルールでremoveFromSourceを指定した場合はルールの指定が優先される
   * @default false
   */
  removeFromSource?: boolean;
};
