/**
 * 値が範囲外の時の扱い
 */
export const RangeMode = {
  /**
   * 最小値を下回った場合は最小値、最大値を上回った場合は最大値にする
   */
  clamp: 'clamp',
  /**
   * 最小値にする
   */
  min: 'min',
  /**
   * 最大値にする
   */
  max: 'max',
  /**
   * 範囲がループしているものとして範囲内の値にする
   */
  loop: 'loop',
  /**
   * 最小値と最大値の間を往復するものとして範囲内の値にする
   */
  pingpong: 'pingpong',
  /**
   * 指定の値に置き換える
   */
  replace: 'replace',
} as const;

/**
 * 値が範囲外の時の扱い
 */
export type RangeMode = (typeof RangeMode)[keyof typeof RangeMode];
