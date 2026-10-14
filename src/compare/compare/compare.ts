import { hasOwn } from '../../object/hasOwn';
import { ComparisonStrategies, type ComparisonStrategy } from './_strategies';
import type { ComparisonOperator } from './constants';
import type { CompareLeft, CompareRight } from './types';

/**
 * 2つの値を指定された演算子で比較する。
 * @param left - 比較する左辺の値
 * @param operator - 演算子 （ComparisonOperatorの値）
 * @param right - 比較する右辺の値（型は演算子ごとに CompareRight で決まる）
 */
export default function compare<O extends ComparisonOperator>(
  left: CompareLeft[O],
  operator: O,
  right: CompareRight[O],
): boolean {
  // プロトタイプのプロパティ（constructor など）を演算子として扱わない
  if (!hasOwn(ComparisonStrategies, operator)) {
    throw new Error(`[compare] Unsupported operator: ${operator}`);
  }

  const strategy: ComparisonStrategy<CompareLeft[O], CompareRight[O]> =
    ComparisonStrategies[operator];
  return strategy(left, right);
}
