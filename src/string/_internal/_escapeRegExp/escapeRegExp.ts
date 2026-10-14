/**
 * エスケープの対象
 * - 先頭の英数字
 * - 構文の文字（`^$\.*+?()[]{}|/`）
 * - その他の区切り文字（`,-=<>#&!%:;@~'"` とバッククォート）
 * - 空白・改行
 * - サロゲートペア（そのまま残すため、単独のサロゲートより先に一致させる）
 * - 単独のサロゲート
 */
const SEARCH_REGEXP =
  /^[0-9A-Za-z]|[\^$\\.*+?()[\]{}|/]|[,\-=<>#&!%:;@~'"`]|\s|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g;

const SYNTAX_CHARS = '^$\\.*+?()[]{}|/';

const CONTROL_ESCAPES: Readonly<Record<string, string>> = {
  '\t': '\\t',
  '\n': '\\n',
  '\v': '\\v',
  '\f': '\\f',
  '\r': '\\r',
};

/**
 * `RegExp.escape` と同じ規則でエスケープする（標準が無い環境向け）
 */
export default function escapeRegExp(target: string): string {
  return target.replace(SEARCH_REGEXP, (char) => {
    if (char.length === 2) {
      return char;
    }
    if (SYNTAX_CHARS.includes(char)) {
      return `\\${char}`;
    }
    const control = CONTROL_ESCAPES[char];
    if (control) {
      return control;
    }
    const code = char.charCodeAt(0);
    return code <= 0xff
      ? `\\x${code.toString(16).padStart(2, '0')}`
      : `\\u${code.toString(16).padStart(4, '0')}`;
  });
}
