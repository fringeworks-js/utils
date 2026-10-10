import { isWithinRange } from '../isWithinRange';

/**
 * 値が範囲外の場合は範囲がループしているものとして範囲内の値を返す
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @returns 最小値から最大値の間の値
 */
const loopInRange = (value: number, min: number, max: number) =>
  _loopInRange(value, min, max);
loopInRange.dataLast = (min: number, max: number) => (value: number) =>
  _loopInRange(value, min, max);
export default loopInRange;

function _loopInRange(value: number, min: number, max: number) {
  if (isWithinRange(value, min, max)) {
    return value;
  }

  const range = max - min;
  if (range === 0) {
    return min;
  }
  const rem = (value - min) % range;
  return min + (rem < 0 ? rem + range : rem);
}
