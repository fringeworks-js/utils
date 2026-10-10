import { isWithinRange } from '../isWithinRange';

/**
 * 値が範囲外の場合は範囲を超えたら逆方向に進むものとして範囲内の値を返す
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @returns 最小値から最大値の間の値
 */
const pingpongInRange = (value: number, min: number, max: number) =>
  _pingpongInRange(value, min, max);
pingpongInRange.dataLast = (min: number, max: number) => (value: number) =>
  _pingpongInRange(value, min, max);
export default pingpongInRange;

function _pingpongInRange(value: number, min: number, max: number) {
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
