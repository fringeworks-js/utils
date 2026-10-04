import type { LooseRecord } from '@fringeworks/types';

/**
 * 分配するプロパティの情報
 * 分配先のグループに対応する値がnullの場合は、
 * 対象のグループに分配されなかったプロパティを返す
 *
 * @param group 分配先のグループ
 */
export type DistributeRules<T extends LooseRecord> = {
  [group: string]: DistributePropertyList<T> | null;
};

/**
 * 分配するプロパティ名の一覧
 */
export type DistributePropertyList<T extends LooseRecord> = readonly (
  | keyof T
  | KeysOfUnion<T>
)[];

export type DistributeOptions = {
  /**
   * 継承されたプロパティも分配対象とする
   */
  includeInherited?: boolean;

  /**
   * 複製した値を分配する
   */
  cloneValue?: boolean;
};

/**
 * 分配した結果
 */
export type DistributeResult<
  T extends LooseRecord,
  R extends DistributeRules<T>,
> = {
  [G in keyof R]: IsRestGroup<R[G]> extends true
    ? Partial<T>
    : R[G] extends DistributePropertyList<T>
      ? PickFromUnion<T, R[G][number]>
      : never;
};

/**
 * 分配されなかったプロパティを受け取るグループかどうか
 * strictNullChecksが無効な環境ではnullがanyに拡大されるため、anyもnullとして扱う
 */
type IsRestGroup<V> = 0 extends 1 & V
  ? true
  : [V] extends [null]
    ? true
    : false;

/**
 * ユニオン型のいずれかのメンバーに存在するキー
 */
type KeysOfUnion<T> = T extends unknown ? keyof T : never;

/**
 * ユニオン型のメンバーごとに、存在するキーのみをPickする
 */
type PickFromUnion<T, K> = T extends unknown
  ? Pick<T, Extract<K, keyof T>>
  : never;
