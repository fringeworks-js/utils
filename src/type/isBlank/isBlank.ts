const REGEX_BLANK = /^\s*$/;

/**
 * 値が `null`・`undefined`・空文字・空白だけの文字列のいずれかであるか判定する。\
 * 空白は正規表現の `\s` と同じ（半角・全角スペース、タブ、改行など）
 * @param value 判定する値
 * @returns `null`・`undefined`・空文字・空白だけの文字列であれば true
 */
export default function isBlank(value: unknown): boolean {
  return (
    value == null || (typeof value === 'string' && REGEX_BLANK.test(value))
  );
}
