import type { ForEachValueOptions } from '../forEachValue';

export type AssignDefinedMutableOptions = ForEachValueOptions & {
  /**
   * 代入したキーを、結果のキーの並びの末尾に移す\
   * target にすでにあるキーは、一度削除してから代入し直す（アクセサーは通常のプロパティになる）。
   * スタイルのように、後ろに並んだキーが優先されるオブジェクトで、values の指定を優先させるときに使う。
   * 整数のキー（`'0'` など）は、JavaScript の仕様で常に先頭に並ぶので動かない
   * @default false
   */
  moveToEnd?: boolean;
};

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
