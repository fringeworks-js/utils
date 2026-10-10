/**
 * 配列の先頭から見て最初のnull,undefined以外の値を返す
 * @param data 配列
 */
const firstPresent = <V>(data: V[]): V | undefined => _firstPresent(data);
firstPresent.dataLast =
  <V>() =>
  (data: V[]) =>
    firstPresent(data);
export default firstPresent;

function _firstPresent<V>(data: V[]): V | undefined {
  return data?.find(_isTarget);
}
function _isTarget<V>(value: V) {
  return value != null;
}
