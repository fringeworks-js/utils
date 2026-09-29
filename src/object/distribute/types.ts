import type { LooseRecord } from '@niche-works/types';

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
export type DistributePropertyList<T extends LooseRecord> =
  readonly (keyof T)[];

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
  [G in keyof R]: R[G] extends null
    ? Partial<T>
    : R[G] extends DistributePropertyList<T>
      ? Pick<T, R[G][number]>
      : never;
};
