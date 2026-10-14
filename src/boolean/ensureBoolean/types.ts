export type EnsureBooleanOptions = {
  /**
   * trueとして扱う文字列\
   * 渡された値が文字列の場合にだけ使う（文字列以外の値は `!!data` で変換する）
   * @default ['true', 'True', 'TRUE', '1']
   */
  trueValues?: readonly string[];

  /**
   * 渡された値が文字列の場合は大文字小文字を無視して比較する
   */
  ignoreCase?: boolean;
};
