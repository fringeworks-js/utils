/**
 * createExtractor で作った、囲み文字で囲まれた部分を抽出する関数
 */
export type Extractor = {
  /**
   * 囲み文字で囲まれた部分を抽出する
   * @param str 対象の文字列。空文字・null・undefined は空配列を返す
   * @param options オプション
   * @returns 抽出した文字列の配列
   */
  (str: string, options?: ExtractorOptions): string[];

  /**
   * 開始の囲み文字
   */
  readonly prefix: string;

  /**
   * 終了の囲み文字
   */
  readonly suffix: string;
};

/**
 * Extractor のオプション
 */
export type ExtractorOptions = {
  /**
   * 囲み文字を含めて、元の文字列のまま返すかどうか（keepWhitespace に関わらず空白も残す）
   * @default false
   */
  keepDelimiters?: boolean;

  /**
   * 囲み文字の内側の前後の空白を残すかどうか。false の場合は削除する
   * @default false
   */
  keepWhitespace?: boolean;

  /**
   * 重複したものを除外するかどうか
   * @default false
   */
  unique?: boolean;
};
