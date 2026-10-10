import { isWithinRange } from '../isWithinRange';

/**
 * 値が範囲外の場合は指定の値に置き換える
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @param replacement 範囲外の場合に返す値
 * @returns 範囲内の場合は value、範囲外の場合は replacement
 */
const replaceOutOfRange = (
  value: number,
  min: number,
  max: number,
  replacement: number,
) => _replaceOutOfRange(value, min, max, replacement);
replaceOutOfRange.dataLast =
  (min: number, max: number, replacement: number) => (value: number) =>
    _replaceOutOfRange(value, min, max, replacement);
export default replaceOutOfRange;

function _replaceOutOfRange(
  value: number,
  min: number,
  max: number,
  replacement: number,
) {
  return isWithinRange(value, min, max) ? value : replacement;
}
