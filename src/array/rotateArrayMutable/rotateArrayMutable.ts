import { pushAllMutable } from '../pushAllMutable';
import type { RotateArrayMutableOptions } from './types';

/**
 * 配列の前方の要素を削除し末尾に追加する（破壊的変更）
 * @param data 対象の配列
 * @param options オプション
 * @returns ローテーションした同じ配列
 */
export default function rotateArrayMutable<I>(
  data: I[],
  options: RotateArrayMutableOptions = {},
): I[] {
  if (data.length === 0) {
    return data;
  }
  const { count = 1 } = options;
  // 負の数（右シフト）は同じ結果になる正の数（左シフト）に変換
  const offset = ((count % data.length) + data.length) % data.length;
  if (offset !== 0) {
    pushAllMutable(data, data.splice(0, offset));
  }
  return data;
}
