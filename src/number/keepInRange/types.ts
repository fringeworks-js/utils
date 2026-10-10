import type { RangeMode } from './constants';

export type KeepInRangeOptions = {
  /**
   * 値が範囲外の場合の扱い
   * - 'clamp': 最小値未満の場合は最小値、最大値を超える場合は最大値を返す
   * - 'min': 最小値を返す
   * - 'max': 最大値を返す
   * - 'loop': 範囲がループしているものとして算出した値を返す
   * - 'pingpong': 最小値と最大値の間を往復するものとして算出した値を返す
   * - 'replace': `outOfRangeValue`（未指定の場合は0）を返す
   * @default 'clamp'
   */
  mode?: RangeMode;
  /**
   * 値が最小値を下回っている場合の扱い
   * 未指定の場合はmodeの値を適用
   */
  minMode?: RangeMode;
  /**
   * 値が最大値を超えている場合の扱い
   * 未指定の場合はmodeの値を適用
   */
  maxMode?: RangeMode;
  /**
   * mode=`replace`の場合に返す値
   * @default 0
   */
  outOfRangeValue?: number;
  /**
   * 最小値を下回っていてminMode=`replace`の場合に返す値
   * 未指定の場合はoutOfRangeValueの値を適用
   */
  belowMinValue?: number;
  /**
   * 最大値を超えていてmaxMode=`replace`の場合に返す値
   * 未指定の場合はoutOfRangeValueの値を適用
   */
  aboveMaxValue?: number;
};
