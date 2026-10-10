/**
 * strはprefixで始まり、suffixで終わっているか
 * prefixとsuffixの間には最低1文字が必要
 * @param str 文字列
 * @param prefix 接頭語
 * @param suffix 接尾語
 */
const isSurroundedBy = (
  str: string,
  prefix: string,
  suffix: string = prefix,
): boolean => _isSurroundedBy(str, prefix, suffix);
isSurroundedBy.dataLast =
  (prefix: string, suffix: string = prefix) =>
  (str: string): boolean =>
    _isSurroundedBy(str, prefix, suffix);
export default isSurroundedBy;

function _isSurroundedBy(str: string, prefix: string, suffix: string): boolean {
  if (str) {
    if (str.length <= prefix.length + suffix.length) {
      // prefix+suffixよりも短い場合はfalse
      return false;
    }
    return str.startsWith(prefix) && str.endsWith(suffix);
  } else {
    return false;
  }
}
