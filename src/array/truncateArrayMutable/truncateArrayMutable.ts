/**
 * 配列を指定の長さまで切り詰める（破壊的変更）\
 * 配列が指定の長さ以下の場合は何もしない（`length` への代入と違い、配列を伸ばさない）
 * @param data 配列
 * @param length 切り詰めた後の長さ。小数は切り捨て、負の数は0として扱う。NaNの場合は何もしない
 * @returns 同じ配列
 */
export default function truncateArrayMutable<T>(
  data: T[],
  length: number,
): T[] {
  // NaNを0として扱うと配列が空になるため、何もしない
  if (Number.isNaN(length)) {
    return data;
  }
  const size = Math.max(0, Math.trunc(length));
  if (size < data.length) {
    data.length = size;
  }
  return data;
}
