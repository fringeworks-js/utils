export type ThrottleOptions = {
  /**
   * 実行の間隔（ミリ秒）
   *
   * @default 240
   */
  wait?: number;

  /**
   * 実行するタイミング
   *
   * - 'both': `★-★-★`
   * - 'start': `★-★-☆`
   * - 'end': `☆-★-★`
   *
   * \* ★: 実行、☆: 未実行
   *
   * @default 'both'
   */
  triggerAt?: 'both' | 'start' | 'end';
};

export interface ThrottleResult<ARGS extends unknown[]> {
  (...args: ARGS): void;
  cancel(): void;
  flush(): void;
  isIdle(): boolean;
}
