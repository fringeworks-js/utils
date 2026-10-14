/**
 * 値がmin以下の場合はmin、max以上の場合はmax、それ以外の場合はvalueを返す\
 * min が max より大きい場合は入れ替えて扱う
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @returns 最小値から最大値の間の値
 */
export default function clampInRange(
  value: number,
  min: number,
  max: number,
): number {
  if (min > max) {
    return clampInRange(value, max, min);
  }
  return Math.min(Math.max(value, min), max);
}
