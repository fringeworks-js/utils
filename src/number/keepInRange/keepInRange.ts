import { clampInRange } from '../clampInRange';
import { loopInRange } from '../loopInRange';
import { pingpongInRange } from '../pingpongInRange';
import { replaceOutOfRange } from '../replaceOutOfRange';
import { RangeMode } from './constants';
import type { KeepInRangeOptions } from './types';

/**
 * 範囲外の場合の扱いごとの処理
 */
const STRATEGIES: Record<
  RangeMode,
  (value: number, min: number, max: number, replacement: number) => number
> = {
  [RangeMode.clamp]: clampInRange,
  [RangeMode.min]: (value, min, max) => replaceOutOfRange(value, min, max, min),
  [RangeMode.max]: (value, min, max) => replaceOutOfRange(value, min, max, max),
  [RangeMode.loop]: loopInRange,
  [RangeMode.pingpong]: pingpongInRange,
  [RangeMode.replace]: replaceOutOfRange,
};

/**
 * 値が指定の範囲内に収まるようにする\
 * min が max より大きい場合は入れ替えて扱う
 *
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @param options オプション
 * @returns
 */
export default function keepInRange(
  value: number,
  min: number,
  max: number,
  options: KeepInRangeOptions = {},
): number {
  if (min > max) {
    return keepInRange(value, max, min, options);
  }
  const {
    mode = RangeMode.clamp,
    minMode = mode,
    maxMode = mode,
    outOfRangeValue = 0,
    belowMinValue = outOfRangeValue,
    aboveMaxValue = outOfRangeValue,
  } = options;
  // 適用する扱いを決定
  const [currentMode, replacement] =
    value < min ? [minMode, belowMinValue] : [maxMode, aboveMaxValue];
  return STRATEGIES[currentMode](value, min, max, replacement);
}
