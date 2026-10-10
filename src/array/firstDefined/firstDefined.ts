/**
 * 配列の先頭から見て最初のundefined以外の値を返す
 * @param data 配列
 */
const firstDefined = <V>(data: V[]): V | undefined => _firstDefined(data);
firstDefined.dataLast =
  <V>() =>
  (data: V[]) =>
    firstDefined(data);
export default firstDefined;

function _firstDefined<V>(data: V[]): V | undefined {
  return data?.find(_isTarget);
}
function _isTarget<V>(value: V) {
  return value !== undefined;
}
