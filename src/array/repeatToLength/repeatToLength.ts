/**
 * 指定のサイズになるまで、引数の配列を繰り返した新しい配列を返す。
 * @param data 繰り返す配列。null・undefinedは空配列として扱う
 * @param length 配列の長さ。負の数は逆順に繰り返す。小数は切り捨て、NaN・Infinityは0として扱う
 */
export default function repeatToLength<T>(
  data: T[] | null | undefined,
  length: number,
): T[] {
  // 小数は切り捨て、NaN・Infinityは0として扱う
  const size = Number.isFinite(length) ? Math.abs(Math.trunc(length)) : 0;
  if (size === 0 || !data || data.length === 0) {
    return [];
  }

  // lengthが負の場合は逆順
  const source = length < 0 ? [...data].reverse() : data;
  const result: T[] = [];
  for (let i = 0; i < size; i++) {
    result.push(source[i % source.length]!);
  }
  return result;
}
