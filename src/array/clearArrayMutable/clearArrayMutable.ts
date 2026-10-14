/**
 * 配列の要素を全て削除する（破壊的変更）
 * @param data 対象の配列
 * @returns 削除された全要素
 */
export default function clearArrayMutable<T>(data: T[]): T[] {
  // 全要素を削除し、削除された要素の配列を返す
  return data.splice(0);
}
