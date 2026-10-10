/**
 * 先頭を子文字に変換します
 * @param str
 */
const lowerFirst = (str: string): string => _lowerFirst(str);
lowerFirst.dataLast =
  () =>
  (str: string): string =>
    _lowerFirst(str);
export default lowerFirst;

function _lowerFirst(str: string): string {
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}
