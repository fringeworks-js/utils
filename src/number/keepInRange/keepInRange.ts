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
 * 値が指定の範囲内に収まるようにする
 *
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 * @param options オプション
 * @returns
 */
const keepInRange = (
  value: number,
  min: number,
  max: number,
  options: KeepInRangeOptions = {},
) => _keepInRange(value, min, max, options);
keepInRange.dataLast =
  (min: number, max: number, options: KeepInRangeOptions = {}) =>
  (value: number) =>
    _keepInRange(value, min, max, options);
export default keepInRange;

function _keepInRange(
  value: number,
  min: number,
  max: number,
  options: KeepInRangeOptions = {},
) {
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
