import type { ForEachValueOptions } from '../forEachValue';

export type AssignPresentMutableOptions = ForEachValueOptions & {
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
 * assignPresentMutable・assignPresent の結果の型\
 * values の値が null・undefined のキーは反映されないので、target の値の型も残す。
 * target に無いキーは、反映されない場合は undefined になる
 */
export type AssignPresentResult<T, V> = {
  [K in keyof T | keyof V]: K extends keyof V
    ? K extends keyof T
      ? | Exclude<V[K], null | undefined>
        | (_MayBeNullish<V[K]> extends true ? T[K] : never)
      : | Exclude<V[K], null | undefined>
        | (_MayBeNullish<V[K]> extends true ? undefined : never)
    : K extends keyof T
      ? T[K]
      : never;
};

/**
 * null・undefinedになりうる型か
 */
type _MayBeNullish<X> = null extends X
  ? true
  : undefined extends X
    ? true
    : false;
