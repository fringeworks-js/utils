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
 *
 * 大小の比較は値の型を問わず（数値・文字列・Date など）、
 * JavaScript の比較演算子の挙動に任せる
 */
export const ComparisonStrategies = {
  [EQ]: (left, right) => left === right,
  [NE]: (left, right) => left !== right,
  [GT]: (left, right) => (left as number) > (right as number),
  [LT]: (left, right) => (left as number) < (right as number),
  [GE]: (left, right) => (left as number) >= (right as number),
  [LE]: (left, right) => (left as number) <= (right as number),
  [LOOSE_EQ]: (left, right) => left == right,
  [LOOSE_NE]: (left, right) => left != right,
  [BETWEEN]: ((value, range: [unknown, unknown]) =>
    Array.isArray(range) &&
    (value as number) >= (range[0] as number) &&
    (value as number) <= (range[1] as number)) as ComparisonStrategy,
  [IN]: ((value, list: unknown[]) =>
    list.includes(value)) as ComparisonStrategy,
  [LIKE]: ((value: string, pattern: string) =>
    value.includes(pattern)) as ComparisonStrategy,
} as const satisfies Record<ComparisonOperator, ComparisonStrategy>;

/**
 * 全比較関数
 */
export type ComparisonStrategies = typeof ComparisonStrategies;
