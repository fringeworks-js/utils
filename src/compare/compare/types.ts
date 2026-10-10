import type { ComparisonStrategies } from './_strategies';
import type { ComparisonOperator } from './constants';

/**
 * 演算子ごとの左辺の値の型
 */
export type CompareLeft = {
  [O in ComparisonOperator]: Parameters<ComparisonStrategies[O]>[0];
};

/**
 * 演算子ごとの右辺の値の型
 */
export type CompareRight = {
  [O in ComparisonOperator]: Parameters<ComparisonStrategies[O]>[1];
};
