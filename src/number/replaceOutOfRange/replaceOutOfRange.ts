import { isWithinRange } from '../isWithinRange';

/**
 * 値が範囲外の場合は指定の値に置き換える\
 * min が max より大きい場合は入れ替えて扱う
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @param replacement 範囲外の場合に返す値
 * @returns 範囲内の場合は value、範囲外の場合は replacement
 */
export default function replaceOutOfRange(
  value: number,
  min: number,
  max: number,
  replacement: number,
): number {
  return isWithinRange(value, min, max) ? value : replacement;
}
