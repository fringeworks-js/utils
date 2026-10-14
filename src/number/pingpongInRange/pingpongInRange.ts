import { isWithinRange } from '../isWithinRange';

/**
 * 値が範囲外の場合は範囲を超えたら逆方向に進むものとして範囲内の値を返す\
 * min が max より大きい場合は入れ替えて扱う
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @returns 最小値から最大値の間の値
 */
export default function pingpongInRange(
  value: number,
  min: number,
  max: number,
): number {
  if (min > max) {
    return pingpongInRange(value, max, min);
  }
  if (isWithinRange(value, min, max)) {
    return value;
  }

  const range = max - min;
  if (range === 0) {
    return min;
  }
  const doubleRange = range * 2;
  const rem = (value - min) % doubleRange;
  const phase = rem < 0 ? rem + doubleRange : rem;
  return phase <= range ? min + phase : max - (phase - range);
}
