import type { StringComparison } from '../../string/createStringMatcher';
import type { ForEachValueOptions } from '../forEachValue';

export type AssignOnlyMutableOptions = ForEachValueOptions & {
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
 * assignOnlyMutable・assignOnly で、値を代入するかを判定する関数\
 * 真を返したプロパティだけを代入する
 * @param value values の値
 * @param key プロパティのキー
 * @param targetValue target の今の値
 */
export type AssignOnlyPredicate<V> = (
  value: V[keyof V],
  key: string | symbol,
  targetValue: unknown,
) => boolean;

/**
 * assignOnlyMutable・assignOnly の、キーに対する条件の1つ
 *
 * - キー: キーが一致するプロパティだけを代入する（数値は文字列にして比べる）
 * - RegExp: キーが正規表現に一致するプロパティだけを代入する（symbol のキーは代入しない）
 * - StringComparison: キーが部分一致などの比べ方に合うプロパティだけを代入する（symbol のキーは代入しない）
 */
export type AssignOnlyConditionItem = PropertyKey | RegExp | StringComparison;

/**
 * assignOnlyMutable・assignOnly の条件
 *
 * - キーに対する条件、またはその配列: 条件に合うキーのプロパティだけを代入する。配列はどれかに合えば代入する（OR）
 * - 関数: 真を返したプロパティだけを代入する
 */
export type AssignOnlyCondition<V> =
  | AssignOnlyConditionItem
  | readonly AssignOnlyConditionItem[]
  | AssignOnlyPredicate<V>;

/**
 * assignOnlyMutable・assignOnly の結果の型\
 * values のどのキーが代入されるかは条件で決まるので、target の値の型も残す。
 * target に無いキーは、代入されない場合は undefined になる
 */
export type AssignOnlyResult<T, V> = {
  [K in keyof T | keyof V]: K extends keyof V
    ? K extends keyof T
      ? T[K] | V[K]
      : V[K] | undefined
    : K extends keyof T
      ? T[K]
      : never;
};

/**
 * 条件にキーを指定したときの assignOnlyMutable・assignOnly の結果の型\
 * 指定したキーだけが代入される。values で省略できるキーは、target の値の型も残す
 * （target に無いキーは undefined になる）
 */
export type AssignOnlyKeysResult<T, V, K extends keyof V> = {
  [P in keyof T | K]: P extends K
    ? P extends keyof T
      ? V[P] | (_IsOptional<V, P> extends true ? T[P] : never)
      : V[P] | (_IsOptional<V, P> extends true ? undefined : never)
    : P extends keyof T
      ? T[P]
      : never;
};

/**
 * 省略できるプロパティか
 */
type _IsOptional<V, P extends keyof V> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {} extends Pick<V, P> ? true : false;
