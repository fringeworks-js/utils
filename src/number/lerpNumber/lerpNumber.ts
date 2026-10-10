import type { LerpNumberOptions } from './types';

/**
 * 基準値と目標値の間を、指定された割合で補間した値を算出する。
 * (線形補間: start + (end - start) * ratio)
 *
 * @param value 目標値（1.0のときの値）
 * @param ratio 適用する割合（0.0 〜 1.0）
 * @param options オプション
 * @returns 算出された数値
 */
const lerpNumber = (
  value: number,
  ratio: number,
  options: LerpNumberOptions = {},
): number => _lerpNumber(value, ratio, options);
lerpNumber.dataLast =
  (ratio: number, options: LerpNumberOptions = {}) =>
  (value: number): number =>
    _lerpNumber(value, ratio, options);
export default lerpNumber;

function _lerpNumber(
  value: number,
  ratio: number,
  options: LerpNumberOptions = {},
): number {
  const { baseValue = 0 } = options;
  const diff = value - baseValue;
  const currentDiff = diff * ratio;
  return baseValue + currentDiff;
}
