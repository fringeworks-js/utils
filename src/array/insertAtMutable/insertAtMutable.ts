import { pushAllMutable } from '../pushAllMutable';

/**
 * 配列の指定の位置に要素を追加する（破壊的変更）
 * インデックスは0～配列の長さの範囲に収める
 * @param data 配列
 * @param index 追加先のインデックス
 * @param items 追加する要素。null・undefinedは空配列として扱う
 * @returns 要素を追加した同じ配列
 */
export default function insertAtMutable<T, U = T>(
  data: T[],
  index: number,
  items: U[] | null | undefined,
): (T | U)[] {
  // 追加した後は U の要素も含む配列になる
  const array: (T | U)[] = data;
  // splice(index, 0, ...items) は要素数が多いと引数の上限を超えるため、
  // 挿入位置以降を切り離し、追加する要素と合わせて末尾に戻す
  const tail = array.splice(Math.max(0, Math.min(index, array.length)));
  pushAllMutable(array, items);
  return pushAllMutable(array, tail);
}
