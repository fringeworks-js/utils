/**
 * 値が範囲内に収まっているかを判定する（境界を含まない）
 * @param value 判定する値
 * @param min 最小値
 * @param max 最大値
 * @returns 範囲内であれば true
 */
const isStrictlyWithinRange = (
  value: number,
  min: number,
  max: number,
): boolean => _isStrictlyWithinRange(value, min, max);
isStrictlyWithinRange.dataLast =
  (min: number, max: number) =>
  (value: number): boolean =>
    _isStrictlyWithinRange(value, min, max);
export default isStrictlyWithinRange;

function _isStrictlyWithinRange(
  value: number,
  min: number,
  max: number,
): boolean {
  return value > min && value < max;
}
