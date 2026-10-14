export type GetValidMinMaxOptions = {
  /**
   * minがnull・undefined・NaNの場合の値
   * @default -Infinity
   */
  defaultMin?: number;

  /**
   * maxがnull・undefined・NaNの場合の値
   * @default Infinity
   */
  defaultMax?: number;
};
