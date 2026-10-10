import type { MeasureOptions, MeasureResult } from '../measure';

/**
 * measureAsync関数のオプション
 */
export type MeasureAsyncOptions<A extends unknown[] = unknown[]> =
  MeasureOptions<A>;

/**
 * measureAsync関数の戻り値
 */
export type MeasureAsyncResult<R = unknown> = MeasureResult<R>;
