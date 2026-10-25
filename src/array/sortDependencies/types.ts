export type SortDependenciesGetId<I> = (item: I) => unknown;
export type SortDependenciesGetDependencies<I> = (item: I) => I | readonly I[];

export type SortDependenciesOptions<I> = {
  /**
   * IDにあたるプロパティ
   * 未指定の場合は0
   */
  id?: string | number | SortDependenciesGetId<I>;

  /**
   * 依存先の情報を持ったプロパティ
   * 未指定の場合は1
   */
  dependencies?: string | number | SortDependenciesGetDependencies<I>;

  /**
   * 依存先のIDにあたるプロパティ
   * 未指定の場合、依存先がオブジェクトならidと同じ設定で取得し、
   * それ以外は依存先の値そのものをIDとする
   */
  dependencyId?: string | number | SortDependenciesGetId<I>;

  /**
   * 与えるデータがツリー構造の場合はtrue
   */
  tree?: boolean;

  /**
   * 実体がない依存先は処理対象外とする
   */
  ignoreMissing?: boolean;

  /**
   * ソート順
   * - false: 末端 -> ルート
   * - true: ルート -> 末端
   */
  reverse?: boolean;
};
