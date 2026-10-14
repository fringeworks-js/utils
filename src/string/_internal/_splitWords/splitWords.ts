/**
 * 英字・数字以外の文字の並び（単語の区切り）
 */
const SEPARATOR = /[^\p{L}\p{M}\p{N}]+/u;

/**
 * 単語の途中に入る引用符（`don't` など）
 */
const APOSTROPHE = /['\u2019]/g;

/**
 * 小文字・数字の後の大文字（`helloWorld` の `oW`、`version2Beta` の `2B`）
 */
const LOWER_UPPER = /([\p{Ll}\d])(\p{Lu})/gu;

/**
 * 略語の後に続く単語の先頭（`XMLParser` の `LPa`）
 */
const ACRONYM_WORD = /(\p{Lu})(\p{Lu}\p{Ll})/gu;

/**
 * 文字列を単語に分ける
 *
 * - 英字（`\p{L}`・`\p{M}`）と数字（`\p{N}`）以外の文字を区切りとして扱い、先頭・末尾の区切りは除く
 * - 引用符（`'`・`’`）は区切らずに取り除く（`don't` は `dont`）
 * - 小文字・数字の後の大文字の前で区切る（`helloWorld` は `hello` / `World`）
 * - 連続する大文字（略語）は、小文字が続く最後の1文字の前で区切る（`XMLParser` は `XML` / `Parser`）
 * - 英字の後の数字の前では区切らない（`i18n`・`utf8`・`base64` は1つの単語）
 */
export default function splitWords(str: string): string[] {
  return str
    .replace(APOSTROPHE, '')
    .replace(LOWER_UPPER, '$1 $2')
    .replace(ACRONYM_WORD, '$1 $2')
    .split(SEPARATOR)
    .filter((word) => word !== '');
}
