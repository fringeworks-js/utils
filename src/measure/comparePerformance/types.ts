import type { MeasureOptions } from '../measure';

/**
 * 測定する対象
 */
export type ComparePerformanceTarget<
  A extends unknown[] = unknown[],
  R = unknown,
> = {
  /**
   * ID
   */
  id: string;

  /**
   * 測定対象の関数
   * @param args
   * @returns
   */
  fn: (...args: A) => R;
};

/**
 * comparePerformanceのオプション
 */
export type ComparePerformanceOptions<
  A extends unknown[] = unknown[],
  R = unknown,
> = MeasureOptions<A> & {
  /**
   * ID
   */
  id?: string;

  /**
   * 測定対象
   */
  targets: ComparePerformanceTarget<A, R>[];

  /**
   * 測定を何周行うか
   * 1周ごとに各測定対象の関数を`iterations`回ずつ実行し、周ごとに測定する順番を入れ替える
   * @default 10
   */
  rounds?: number;

  /**
   * trueの場合、測定前に各測定対象を1回ずつ実行する
   */
  warmUp?: boolean;
};

/**
 * 計測された処理時間
 */
export type ElapsedTimes = {
  /**
   * 測定対象毎の処理時間
   */
  [targetId: string]: number;
};

/**
 * 測定結果
 */
export type ComparePerformanceResult<
  A extends unknown[] = unknown[],
  R = unknown,
> = {
  /**
   * 測定結果毎の平均
   */
  average: ElapsedTimes;

  /**
   * 全体の平均
   */
  totalAverage: number;

  /**
   * 順位
   */
  order: ComparePerformanceTarget<A>[];

  /**
   * ID
   */
  id?: string;

  /**
   * 測定結果
   */
  results: ElapsedTimes[];

  /**
   * 測定結果毎の戻り値(最後の処理分のみ)
   */
  returnValues: { [targetId: string]: R };

  /**
   * 測定開始日時
   */
  start: Date;

  /**
   * 測定終了日時
   */
  end: Date;
};
