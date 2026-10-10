import type { ForEachValueOptions } from '../forEachValue';

export type AssignDefinedMutableOptions = ForEachValueOptions & {
  /**
   * 反映元の値がnullの場合は処理しない
   */
  skipNull?: boolean;
};
