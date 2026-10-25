import type { ForEachValueOptions } from '../forEachValue';

export type AssignDefinedMutableOptions = ForEachValueOptions;

/**
 * assignDefinedMutable・assignDefined の結果の型\
 * values の値が undefined のキーは反映されないので、target の値の型も残す
 */
export type AssignDefinedResult<T, V> = {
  [K in keyof T | keyof V]: K extends keyof V
    ? K extends keyof T
      ? Exclude<V[K], undefined> | (undefined extends V[K] ? T[K] : never)
      : V[K]
    : K extends keyof T
      ? T[K]
      : never;
};
