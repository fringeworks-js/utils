import type { ForEachValueOptions } from '../forEachValue';

export type FillDefaultsMutableOptions = ForEachValueOptions & {
  /**
   * デフォルト値がnullの場合は処理しない
   */
  skipNull?: boolean;

  /**
   * 反映先のオブジェクトのプロパティ値がnullの場合にも設定する
   */
  overwriteNull?: boolean;
};

/**
 * fillDefaultsMutable・fillDefaults の結果の型\
 * target の値が undefined（overwriteNull の場合は null も）のキーはデフォルト値で埋まるので、defaultValues の値の型を加える
 */
export type FillDefaultsResult<T, V> = {
  [K in keyof T | keyof V]: K extends keyof T
    ? K extends keyof V
      ? undefined extends T[K]
        ? Exclude<T[K], undefined> | V[K]
        : null extends T[K]
          ? T[K] | V[K]
          : T[K]
      : T[K]
    : K extends keyof V
      ? V[K]
      : never;
};
