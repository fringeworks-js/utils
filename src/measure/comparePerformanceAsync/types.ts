import type {
  ComparePerformanceOptions,
  ComparePerformanceResult,
  ComparePerformanceTarget,
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
> = Omit<ComparePerformanceResult<A, R>, 'order'> & {
  /**
   * 平均が短い順に並べた測定対象
   */
  order: ComparePerformanceTarget<A, Promise<R>>[];
};
