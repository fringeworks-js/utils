/**
 * 比較演算子
 */
export const ComparisonOperator = {
  EQ: '===',
  NE: '!==',
  GT: '>',
  LT: '<',
  GE: '>=',
  LE: '<=',
  /** 緩い比較 (==) */
  LOOSE_EQ: '==',
  /** 緩い否定 (!=) */
  LOOSE_NE: '!=',
  /** 範囲内 (閉区間 [min, max]) */
  BETWEEN: 'between',
  /** 配列に含まれるか */
  IN: 'in',
  /** 部分一致 (String.includes) */
  LIKE: 'like',
} as const;

/**
 * 比較演算子
 */
export type ComparisonOperator =
  (typeof ComparisonOperator)[keyof typeof ComparisonOperator];
