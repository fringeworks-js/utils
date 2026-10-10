/**
 * 配列の指定の位置に要素を追加する（破壊的変更）
 * インデックスは0～配列の長さの範囲に収める
 * @param data 配列
 * @param index 追加先のインデックス
 * @param items 追加する要素
 * @returns 要素を追加した同じ配列
 */
const insertAtMutable = <T, U = T>(
  data: T[],
  index: number,
  items: U[],
): (T | U)[] => _insertAtMutable<T | U>(data, index, items);
insertAtMutable.dataLast =
  <U>(index: number, items: U[]) =>
  <T>(data: T[]): (T | U)[] =>
    _insertAtMutable<T | U>(data, index, items);
export default insertAtMutable;

function _insertAtMutable<T>(data: T[], index: number, items: T[]): T[] {
  if (data) {
    data.splice(Math.max(0, Math.min(index, data.length)), 0, ...items);
  }
  return data;
}
