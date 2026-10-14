import type { LerpDateOptions } from './types';

/**
 * 基準値と目標値の間を、指定された割合で補間した日時を算出する。
 * (線形補間: start + (end - start) * ratio)
 *
 * @param value 目標値（1.0のときの値）
 * @param ratio 適用する割合（0.0 〜 1.0。範囲外の場合は外挿する）
 * @param options オプション
 * @returns 算出された日時
 */
export default function lerpDate(
  value: Date,
  ratio: number,
  options: LerpDateOptions = {},
): Date {
  // baseValue が未指定の場合は、呼び出すたびにその時点の現在時刻を使う
  const { baseValue = new Date() } = options;
  const base = baseValue.getTime();
  const diff = value.getTime() - base;
  const currentDiff = diff * ratio;
  return new Date(base + currentDiff);
}
