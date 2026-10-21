import type { ForEachValueOptions } from '../forEachValue';

export type AssignDefinedMutableOptions = ForEachValueOptions & {
  /**
   * 反映元の値がnullの場合は処理しない
   */
  skipNull?: boolean;
};

/**
 * assignDefinedMutable・assignDefined の結果の型\
 * values の値が undefined（skipNull の場合は null も）のキーは反映されないので、target の値の型も残す
 */
export type AssignDefinedResult<T, V> = {
  [K in keyof T | keyof V]: K extends keyof V
    ? K extends keyof T
      ? | Exclude<V[K], undefined>
        | (undefined extends V[K] ? T[K] : null extends V[K] ? T[K] : never)
      : V[K]
    : K extends keyof T
      ? T[K]
      : never;
};
