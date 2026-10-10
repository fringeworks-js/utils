import { ComparisonOperator } from './constants';

/**
 * 比較関数
 */
export type ComparisonStrategy<L = unknown, R = L> = (
  left: L,
  right: R,
) => boolean;

const { EQ, NE, GT, LT, GE, LE, LOOSE_EQ, LOOSE_NE, BETWEEN, IN, LIKE } =
  ComparisonOperator;

/**
 * 全比較関数
 */
export const ComparisonStrategies = {
  [EQ]: (left, right) => left === right,
  [NE]: (left, right) => left !== right,
  [GT]: (left, right) => left > right,
  [LT]: (left, right) => left < right,
  [GE]: (left, right) => left >= right,
  [LE]: (left, right) => left <= right,
  [LOOSE_EQ]: (left, right) => left == right,
  [LOOSE_NE]: (left, right) => left != right,
  [BETWEEN]: ((value, range: [unknown, unknown]) =>
    Array.isArray(range) &&
    value >= range[0] &&
    value <= range[1]) as ComparisonStrategy,
  [IN]: ((value, list: unknown[]) =>
    list.includes(value)) as ComparisonStrategy,
  [LIKE]: ((value: string, pattern: string) =>
    value.includes(pattern)) as ComparisonStrategy,
} as const satisfies Record<ComparisonOperator, ComparisonStrategy>;

/**
 * 全比較関数
 */
export type ComparisonStrategies = typeof ComparisonStrategies;
