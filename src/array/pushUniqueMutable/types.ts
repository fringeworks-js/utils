export type PushUniqueMutableOptions<T> = {
  /**
   * SetによるO(1)チェックに切り替える要素数の閾値。
   * デフォルト: 100
   */
  threshold?: number;

  /**
   * 2つの要素が等しいかを判定する関数。指定した場合はthresholdに関わらず線形探索になる。
   * デフォルト: `===`
   */
  isEqual?: (value1: T, value2: T) => boolean;
};
