import type {
  ComparePerformanceOptions,
  ComparePerformanceResult,
} from '../comparePerformance';

/**
 * comparePerformanceAsyncのオプション
 */
export type ComparePerformanceAsyncOptions<
  A extends unknown[] = unknown[],
  R = unknown,
> = ComparePerformanceOptions<A, Promise<R>>;

/**
 * 測定結果
 */
export type ComparePerformanceAsyncResult<
  A extends unknown[] = unknown[],
  R = unknown,
> = ComparePerformanceResult<A, R>;
