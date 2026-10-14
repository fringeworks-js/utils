export type SleepOptions = {
  /**
   * 待機を中断するための AbortSignal。\
   * 中断すると `signal.reason`（未設定の場合は `AbortError`）で reject する
   */
  signal?: AbortSignal;
};
