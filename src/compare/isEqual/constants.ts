/**
 * 比較方法
 */
export const CompareMode = {
  /**
   * `===`による比較
   */
  strict: 'strict',

  /**
   * `==`による比較
   */
  loose: 'loose',

  /**
   * 構造による比較（`remeda.isDeepEqual()`、customizer指定時は`isEqualWith()`）
   */
  deep: 'deep',
} as const;

/**
 * 比較方法
 */
export type CompareMode = (typeof CompareMode)[keyof typeof CompareMode];
