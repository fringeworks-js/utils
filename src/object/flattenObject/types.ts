export type FlattenObjectOptions = {
  /**
   * キーの作り方
   *
   * - false: 親のパスを含める
   * - true: 親のパスを含めず、子要素のキーのみを使用する（同名キーは上書きされるため注意）
   *
   * @default false
   */
  leafKeysOnly?: boolean;

  /**
   * 階層を連結する際の区切り文字\
   * 配列の要素は区切り文字に関わらず `[0]` の形で連結する
   *
   * @default '.'
   */
  keySeparator?: string;

  /**
   * 配列の中身の扱い
   *
   *  - false: 展開する
   *  - true: そのまま保持
   *
   * @default false
   */
  keepArrays?: boolean;
};
