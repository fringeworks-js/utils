/**
 * measure関数のオプション
 */
export type MeasureOptions<A extends unknown[] = unknown[]> = {
  /**
   * 関数の実行回数
   */
  iterations?: number;

  /**
   * 関数に渡す引数
   * getArgsが指定されている場合は無効
   */
  args?: A;

  /**
   * 関数に渡す任意の引数を取得する
   */
  getArgs?: () => A;
};

/**
 * measure関数の戻り値
 */
export type MeasureResult<R = unknown> = {
  /**
   * 所要時間
   */
  time: number;

  /**
   * 戻り値
   */
  returnValue: R | undefined;
};
