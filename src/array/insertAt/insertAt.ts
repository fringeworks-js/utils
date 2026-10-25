import { insertAtMutable } from '../insertAtMutable';

/**
 * 配列の指定の位置に要素を追加した新しい配列を返す
 * インデックスは0～配列の長さの範囲に収める
 * @param data 配列。null・undefinedは空配列として扱う
 * @param index 追加先のインデックス
 * @param items 追加する要素。null・undefinedは空配列として扱う
 * @returns 要素を追加した新しい配列
 */
export default function insertAt<T, U = T>(
  data: readonly T[] | null | undefined,
  index: number,
  items: readonly U[] | null | undefined,
): (T | U)[] {
  return insertAtMutable<T | U>(data ? [...data] : [], index, items);
}
