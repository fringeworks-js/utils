import { insertAtMutable } from '../insertAtMutable';

/**
 * 配列の指定の位置に要素を追加した新しい配列を返す
 * インデックスは0～配列の長さの範囲に収める
 * @param data 配列
 * @param index 追加先のインデックス
 * @param items 追加する要素
 * @returns 要素を追加した新しい配列
 */
const insertAt = <T, U = T>(data: T[], index: number, items: U[]): (T | U)[] =>
  _insertAt<T | U>(data, index, items);
insertAt.dataLast =
  <U>(index: number, items: U[]) =>
  <T>(data: T[]): (T | U)[] =>
    _insertAt<T | U>(data, index, items);
export default insertAt;

function _insertAt<T>(data: T[], index: number, items: T[]): T[] {
  return data ? insertAtMutable([...data], index, items) : data;
}
