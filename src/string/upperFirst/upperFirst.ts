/**
 * 先頭を大文字に変換します
 * @param str
 */
const upperFirst = (str: string): string => _upperFirst(str);
upperFirst.dataLast =
  () =>
  (str: string): string =>
    _upperFirst(str);
export default upperFirst;

function _upperFirst(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}
