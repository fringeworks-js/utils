import { isEqual } from '../isEqual';
import { ComparisonOperator } from './constants';
import type { CompareLeft, CompareRight } from './types';

/**
 * 比較関数
 */
export type ComparisonStrategy<L = unknown, R = L> = (
  left: L,
  right: R,
) => boolean;

/**
 * 演算子ごとの比較関数の型
 */
type ComparisonStrategyMap = {
  [O in ComparisonOperator]: ComparisonStrategy<
    CompareLeft[O],
    CompareRight[O]
  >;
};

/**
 * 範囲内か判定する。範囲が配列でない場合は undefined
 */
function isInRange(value: unknown, range: unknown): boolean | undefined {
  if (!Array.isArray(range)) {
    return undefined;
  }
  return (
    (value as number) >= (range[0] as number) &&
    (value as number) <= (range[1] as number)
  );
}

/**
 * 配列に含まれるか判定する。候補が配列でない場合は undefined
 */
function isOneOf(value: unknown, list: unknown): boolean | undefined {
  return Array.isArray(list) ? list.includes(value) : undefined;
}

/**
 * 部分文字列・要素を含むかを調べられる値（文字列または配列）か判定する
 */
function isContainer(value: unknown): boolean {
  return typeof value === 'string' || Array.isArray(value);
}

/**
 * 文字列が部分文字列を含むか、配列が要素を含むか判定する\
 * 対象が文字列・配列でない場合と、文字列に文字列以外を探す場合は undefined
 */
function contains(container: unknown, item: unknown): boolean | undefined {
  if (typeof container === 'string') {
    return typeof item === 'string' ? container.includes(item) : undefined;
  }
  return Array.isArray(container) ? container.includes(item) : undefined;
}

/**
 * 文字列のパターンを正規表現に変換する。正規表現として不正な場合は undefined
 */
function toRegExp(pattern: unknown): RegExp | undefined {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  if (typeof pattern !== 'string') {
    return undefined;
  }
  try {
    return new RegExp(pattern);
  } catch {
    return undefined;
  }
}

const {
  eq,
  ne,
  looseEq,
  looseNe,
  gt,
  gte,
  lt,
  lte,
  deepEqual,
  notDeepEqual,
  between,
  notBetween,
  oneOf,
  notOneOf,
  includes,
  notIncludes,
  includesAll,
  includesAny,
  startsWith,
  endsWith,
  matches,
} = ComparisonOperator;

/**
 * 全比較関数
 *
 * 大小の比較は値の型を問わず（数値・文字列・Date など）、
 * JavaScript の比較演算子の挙動に任せる\
 * 型の上で想定していない形の値（配列でない範囲など）が渡された場合は、否定の演算子も含めて false を返す
 */
export const ComparisonStrategies: ComparisonStrategyMap = {
  [eq]: (left, right) => left === right,
  [ne]: (left, right) => left !== right,
  [looseEq]: (left, right) => left == right,
  [looseNe]: (left, right) => left != right,
  [gt]: (left, right) => (left as number) > (right as number),
  [gte]: (left, right) => (left as number) >= (right as number),
  [lt]: (left, right) => (left as number) < (right as number),
  [lte]: (left, right) => (left as number) <= (right as number),
  [deepEqual]: (left, right) => isEqual(left, right),
  [notDeepEqual]: (left, right) => !isEqual(left, right),
  [between]: (value, range) => isInRange(value, range) === true,
  [notBetween]: (value, range) => isInRange(value, range) === false,
  [oneOf]: (value, list) => isOneOf(value, list) === true,
  [notOneOf]: (value, list) => isOneOf(value, list) === false,
  [includes]: (container, item) => contains(container, item) === true,
  [notIncludes]: (container, item) => contains(container, item) === false,
  [includesAll]: (container, items) =>
    isContainer(container) &&
    Array.isArray(items) &&
    items.every((item) => contains(container, item) === true),
  [includesAny]: (container, items) =>
    isContainer(container) &&
    Array.isArray(items) &&
    items.some((item) => contains(container, item) === true),
  [startsWith]: (value, prefix) =>
    typeof value === 'string' &&
    typeof prefix === 'string' &&
    value.startsWith(prefix),
  [endsWith]: (value, suffix) =>
    typeof value === 'string' &&
    typeof suffix === 'string' &&
    value.endsWith(suffix),
  [matches]: (value, pattern) => {
    const regExp = toRegExp(pattern);
    // test() は g・y フラグの正規表現の lastIndex を変えるため、lastIndex を変えない search() を使う
    return (
      typeof value === 'string' &&
      regExp !== undefined &&
      value.search(regExp) !== -1
    );
  },
};
