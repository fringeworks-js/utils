import type { RemoveAtMutableOptions } from './types';

/**
 * 配列の指定の位置から要素を削除する（破壊的変更）\
 * インデックスが範囲外（負の数・配列の長さ以上・NaN）の場合は何も削除しない
 * @param data 配列
 * @param index 削除を始めるインデックス。小数は切り捨てる
 * @param options オプション
 * @returns 要素を削除した同じ配列
 */
export default function removeAtMutable<T>(
  data: T[],
  index: number,
  options: RemoveAtMutableOptions = {},
): T[] {
  const { count = 1 } = options;
  // 負の数を後ろから数えない（insertAt と同じ）。-0.5 なども切り捨てる前に範囲外とする
  if (!(index >= 0 && index < data.length)) {
    return data;
  }
  // NaN・0以下は何も削除しない
  if (!(count >= 1)) {
    return data;
  }
  data.splice(Math.trunc(index), Math.trunc(count));
  return data;
}
