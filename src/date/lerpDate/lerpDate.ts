import type { LerpDateOptions } from './types';

/**
 * 基準値と目標値の間を、指定された割合で補間した日時を算出する。
 * (線形補間: start + (end - start) * ratio)
 *
 * @param value 目標値（1.0のときの値）
 * @param ratio 適用する割合（0.0 〜 1.0）
 * @param options オプション
 * @returns 算出された日時
 */
const lerpDate = (
  value: Date,
  ratio: number,
  options: LerpDateOptions = {},
): Date => _lerpDate(value, ratio, options);
lerpDate.dataLast =
  (ratio: number, options: LerpDateOptions = {}) =>
  (value: Date): Date =>
    _lerpDate(value, ratio, options);
export default lerpDate;

function _lerpDate(
  value: Date,
  ratio: number,
  options: LerpDateOptions = {},
): Date {
  const { baseValue = new Date() } = options,
    base = baseValue.getTime(),
    diff = value.getTime() - base,
    currentDiff = diff * ratio;
  return new Date(base + currentDiff);
}
