/**
 * 値が範囲内に収まっているかを判定する（境界を含む）\
 * min が max より大きい場合は入れ替えて扱う
 * @param value 判定する値
 * @param min 最小値
 * @param max 最大値
 * @returns 範囲内であれば true
 */
export default function isWithinRange(
  value: number,
  min: number,
  max: number,
): boolean {
  if (min > max) {
    return isWithinRange(value, max, min);
  }
  return value >= min && value <= max;
}
