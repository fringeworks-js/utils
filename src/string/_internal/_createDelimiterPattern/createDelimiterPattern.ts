import * as R from 'remeda';
import { escapeRegExp } from '../../escapeRegExp';

/**
 * 囲み文字の既定値
 */
const DEFAULT_DELIMITERS = ['{{', '}}'] as const;

/**
 * 囲み文字と、囲まれた部分に一致する正規表現
 */
type DelimiterPattern = {
  /**
   * 開始の囲み文字
   */
  readonly prefix: string;

  /**
   * 終了の囲み文字
   */
  readonly suffix: string;

  /**
   * 囲まれた部分に一致する正規表現（`g` フラグ付き）。1番目のグループが囲み文字の内側
   */
  readonly pattern: RegExp;
};

/**
 * 直前に作った結果。囲み文字は呼び出しごとに変わらないことが多いため、1件だけ使い回す
 */
let last: DelimiterPattern | undefined;

/**
 * 囲み文字を正規化し、囲まれた部分に一致する正規表現を作る
 *
 * - 1つの文字列の場合は、開始・終了で共通にする
 * - 省略した場合や、開始・終了のどちらかが空文字の場合は、既定値（`{{` `}}`）にする
 * - 囲み文字の内側は最短一致で、改行を含まない（閉じ忘れた囲み文字が後ろの行まで巻き込まないようにする）
 * @param delimiters 開始・終了の囲み文字
 * @returns 囲み文字と正規表現。`pattern` は共有しているため、`lastIndex` を使う処理には渡さない
 */
export default function createDelimiterPattern(
  delimiters?: string | readonly [string, string],
): DelimiterPattern {
  let [prefix, suffix] = R.isArray(delimiters)
    ? delimiters
    : [delimiters, delimiters];
  if (!prefix || !suffix) {
    [prefix, suffix] = DEFAULT_DELIMITERS;
  }
  if (last?.prefix !== prefix || last.suffix !== suffix) {
    last = {
      prefix,
      suffix,
      pattern: new RegExp(
        `${escapeRegExp(prefix)}(.*?)${escapeRegExp(suffix)}`,
        'g',
      ),
    };
  }
  return last;
}
