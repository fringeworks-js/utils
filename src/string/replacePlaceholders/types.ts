/**
 * replacePlaceholdersのオプション
 */
export type ReplacePlaceholdersOptions = {
  /**
   * プレースホルダーの開始・終了の囲み文字
   * 単一の文字列の場合は開始・終了共通
   * @default ['{{', '}}']
   */
  delimiters?: string | [string, string];

  /**
   * 置換対象が存在しなかったプレイスホルダーは削除する
   */
  removeUnresolved?: boolean;

  /**
   * プレイスホルダーに'.'が含まれていてもvalues直下の値で置換する
   */
  flatKeys?: boolean;
};
