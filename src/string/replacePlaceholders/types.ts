/**
 * replacePlaceholdersのオプション
 */
export type ReplacePlaceholdersOptions = {
  /**
   * プレースホルダーの開始・終了の囲み文字\
   * 1つの文字列の場合は開始・終了共通。空文字の場合は既定値にする
   * @default ['{{', '}}']
   */
  delimiters?: string | readonly [string, string];

  /**
   * 値が見つからなかったプレースホルダーを削除する
   * @default false
   */
  removeUnresolved?: boolean;

  /**
   * プレースホルダーに'.'が含まれていてもvalues直下の値で置換する
   * @default false
   */
  flatKeys?: boolean;

  /**
   * プロトタイプ上のプロパティ（クラスの getter など）も値として使う
   * @default false
   */
  includeInherited?: boolean;
};
