/**
 * 比較演算子
 *
 * 記号の演算子は短い名前（`eq`, `gt` など）、単語の演算子は値と同じ名前をキーにする
 */
export const ComparisonOperator = {
  /** 厳密な等価 (===) */
  eq: '===',
  /** 厳密な不等価 (!==) */
  ne: '!==',
  /** 緩い等価 (==) */
  looseEq: '==',
  /** 緩い不等価 (!=) */
  looseNe: '!=',
  /** より大きい (>) */
  gt: '>',
  /** 以上 (>=) */
  gte: '>=',
  /** より小さい (<) */
  lt: '<',
  /** 以下 (<=) */
  lte: '<=',
  /** 構造が等しい（isEqual） */
  deepEqual: 'deepEqual',
  /** 構造が等しくない（isEqual の否定） */
  notDeepEqual: 'notDeepEqual',
  /** 範囲内 (閉区間 [min, max]) */
  between: 'between',
  /** 範囲外 (閉区間 [min, max] の外) */
  notBetween: 'notBetween',
  /** 配列のいずれかと等しい (Array.includes) */
  oneOf: 'oneOf',
  /** 配列のどれとも等しくない */
  notOneOf: 'notOneOf',
  /** 部分文字列・要素を含む (String.includes / Array.includes) */
  includes: 'includes',
  /** 部分文字列・要素を含まない */
  notIncludes: 'notIncludes',
  /** 配列のすべての部分文字列・要素を含む */
  includesAll: 'includesAll',
  /** 配列のいずれかの部分文字列・要素を含む */
  includesAny: 'includesAny',
  /** 前方一致 (String.startsWith) */
  startsWith: 'startsWith',
  /** 後方一致 (String.endsWith) */
  endsWith: 'endsWith',
  /** 正規表現に一致する */
  matches: 'matches',
} as const;

/**
 * 比較演算子
 */
export type ComparisonOperator =
  (typeof ComparisonOperator)[keyof typeof ComparisonOperator];
