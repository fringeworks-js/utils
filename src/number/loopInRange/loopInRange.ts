/**
 * 範囲がループしているものとして、値を最小値以上・最大値未満の値にする\
 * 最大値は最小値と同じ位置として扱う（剰余と同じ考え方）。
 * min が max より大きい場合は入れ替えて扱う
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @returns 最小値以上・最大値未満の値。最小値と最大値が同じ場合は最小値
 */
export default function loopInRange(
  value: number,
  min: number,
  max: number,
): number {
  if (min > max) {
    return loopInRange(value, max, min);
  }
  if (value >= min && value < max) {
    return value;
  }

  const range = max - min;
  if (range === 0) {
    return min;
  }
  const rem = (value - min) % range;
  return min + (rem < 0 ? rem + range : rem);
}
