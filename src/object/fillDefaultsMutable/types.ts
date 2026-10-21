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
 * target の値が undefined（overwriteNull が true の場合は null も）のキーはデフォルト値で埋まるので、その値を除いて defaultValues の値の型を加える\
 * overwriteNull が boolean で決まらない場合は、null が残る可能性も含める
 */
export type FillDefaultsResult<
  T,
  V,
  // オプションを指定しない場合（すべて省略）を表すため、空のオブジェクト型にする
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  O extends FillDefaultsMutableOptions = {},
> = {
  [K in keyof T | keyof V]: K extends keyof T
    ? K extends keyof V
      ? [Extract<T[K], _MaybeFilledValue<O>>] extends [never]
        ? T[K]
        : Exclude<T[K], _FilledValue<O>> | V[K]
      : T[K]
    : K extends keyof V
      ? V[K]
      : never;
};

/**
 * overwriteNull の指定による null の扱い
 */
type _OverwriteNullMode<O> = O extends { overwriteNull: true }
  ? 'always'
  : O extends { overwriteNull?: false | undefined }
    ? 'never'
    : 'maybe';

/**
 * 必ずデフォルト値で埋まる値
 */
type _FilledValue<O> =
  _OverwriteNullMode<O> extends 'always' ? null | undefined : undefined;

/**
 * デフォルト値で埋まる可能性のある値
 */
type _MaybeFilledValue<O> =
  _OverwriteNullMode<O> extends 'never' ? undefined : null | undefined;
