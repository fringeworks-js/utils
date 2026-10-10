import * as R from 'remeda';
import { ensureArray } from '../ensureArray';
import type {
  SortDependenciesGetDependencies,
  SortDependenciesGetId,
  SortDependenciesOptions,
} from './types';

/**
 * 依存関係のソート
 * 依存関係かつ重複のあるノードのソートを行う
 * @param data 対象の配列
 * @param options オプション
 * @returns 新しい配列
 */
const sortDependencies = <I>(data: I[], options?: SortDependenciesOptions<I>) =>
  _sortDependencies(data, options);
sortDependencies.dataLast =
  <I>(options?: SortDependenciesOptions<I>) =>
  (data: I[]) =>
    _sortDependencies(data, options);
export default sortDependencies;

function _sortDependencies<I>(
  data: I[],
  options: SortDependenciesOptions<I> = {},
): I[] {
  if (!data) {
    return data;
  }
  const {
    id = 0,
    dependencies = 1,
    dependencyId = id,
    ignoreMissing,
    tree,
    reverse,
  } = options;
  const getId: SortDependenciesGetId<I> = R.isFunction(id)
    ? id
    : (item: I) => item[id];
  const getDeps: SortDependenciesGetDependencies<I> = R.isFunction(dependencies)
    ? dependencies
    : (item: I) => item[dependencies];
  const getDepId: SortDependenciesGetId<I> = R.isFunction(dependencyId)
    ? dependencyId
    : (item: I) => item[dependencyId];
  const itemsMap = getUniqItems(
    new Map<unknown, I>(),
    data,
    getId,
    getDeps,
    getDepId,
    tree,
  );

  const sorted = sort(itemsMap, getId, getDeps, getDepId, ignoreMissing);

  return reverse ? sorted.reverse() : sorted;
}

/**
 * 依存する側、依存される側を合わせたユニークな要素の配列を作る
 * @param results
 * @param getDeps
 * @param items
 * @returns
 */
function getUniqItems<I>(
  results: Map<unknown, I>,
  items: I[],
  getId: SortDependenciesGetId<I>,
  getDeps: SortDependenciesGetDependencies<I>,
  getDepId: SortDependenciesGetId<I>,
  tree: boolean,
) {
  for (const item of items) {
    const id = getId(item);
    results.set(id, item);
    if (tree) {
      _getUniqItems(results, ensureArray(getDeps(item)), getDepId, getDeps);
    }
  }
  return results;
}

/**
 * ツリー構造の場合は依存先の要素の取得
 * @param results
 * @param items
 * @param getDepId
 * @param getDeps
 * @returns
 */
function _getUniqItems<I>(
  results: Map<unknown, I>,
  items: I[],
  getDepId: SortDependenciesGetId<I>,
  getDeps: SortDependenciesGetDependencies<I>,
) {
  for (const item of items) {
    const id = getDepId(item);
    results.set(id, item);
    _getUniqItems(results, ensureArray(getDeps(item)), getDepId, getDeps);
  }
  return results;
}

/**
 * 依存関係を考慮したソート
 * @param distinctArray
 * @param array
 * @param getId
 * @param getDeps
 * @returns
 */
function sort<I>(
  itemsMap: Map<unknown, I>,
  getId: SortDependenciesGetId<I>,
  getDeps: SortDependenciesGetDependencies<I>,
  getDepId: SortDependenciesGetId<I>,
  ignoreMissing: boolean,
) {
  const distinctArray = new Array(...itemsMap.values());
  const length = distinctArray.length;
  const sorted = [];
  const visited = {};
  const dependenciesMap = makeDependenciesMap(itemsMap, getDeps, getDepId);
  const reverseLookupMap = makeReverseLookupMap(distinctArray, getId);
  const visit = createVisit(
    itemsMap,
    dependenciesMap,
    reverseLookupMap,
    getId,
    ignoreMissing,
  );

  for (let i = 0; i < length; i++) {
    if (!visited[i]) {
      visit(distinctArray[i], i, new Set<I>(), sorted, visited);
    }
  }

  return sorted;
}

function createVisit<I>(
  itemsMap: Map<unknown, I>,
  dependenciesMap: Map<unknown, Set<unknown>>,
  reverseLookupMap: Map<unknown, number>,
  getId: SortDependenciesGetId<I>,
  ignoreMissing: boolean,
) {
  return function visit(
    item: I,
    index: number,
    dependents: Set<I>,
    sorted: I[],
    visited: { [index: number]: boolean },
  ) {
    if (dependents.has(item)) {
      // 循環参照になっている場合はエラー
      throw new Error('Cyclic dependency: ' + getId(item));
    }

    if (visited[index]) {
      // 処理済みの場合は何もしない
      return;
    }
    visited[index] = true;

    // 処理対象の依存先を取得
    const dependencyIds = Array.from(dependenciesMap.get(getId(item)));

    // 現在処理中の依存関係(パス)に対象を追加
    dependents.add(item);

    // 対象の依存先を全て処理
    const length = dependencyIds.length;
    for (let i = 0; i < length; i++) {
      const dependencyId = dependencyIds[i];
      // 依存先のvisitedの更新用にdistinctArrayn内でのindexも渡す
      const distinctArrayIndex = reverseLookupMap.get(dependencyId);
      if (distinctArrayIndex != null) {
        visit(
          itemsMap.get(dependencyId),
          distinctArrayIndex,
          dependents,
          sorted,
          visited,
        );
      } else if (!ignoreMissing) {
        throw new Error('No substance: ' + dependencyId);
      }
    }

    // 次の要素の依存関係には今回の対象は含まれていないかもしれないので、
    // 現在処理中の依存関係(パス)から対象を削除
    dependents.delete(item);

    // 結果に追加
    sorted.push(item);

    return sorted;
  };
}

/**
 * 要素が依存している要素を取得できるマップを作る
 * @param itemsMap
 * @param getDeps
 * @returns
 */
function makeDependenciesMap<I>(
  itemsMap: Map<unknown, I>,
  getDeps: SortDependenciesGetDependencies<I>,
  getDepId: SortDependenciesGetId<I>,
): Map<unknown, Set<unknown>> {
  const map = new Map<unknown, Set<unknown>>();
  itemsMap.forEach((item, id) => {
    if (!map.has(id)) {
      map.set(id, new Set<unknown>());
    }
    // 依存している要素を収集する
    const deps = ensureArray(getDeps(item));
    for (const depItem of deps) {
      // 対象要素に依存している要素を追加する
      map.get(id).add(getDepId(depItem));
    }
  });
  return map;
}

/**
 * 逆引き用のマップを作る
 * @param distinctArray
 * @returns
 */
function makeReverseLookupMap<I>(
  distinctArray: I[],
  getId: SortDependenciesGetId<I>,
): Map<unknown, number> {
  return distinctArray.reduce((map, item, index) => {
    map.set(getId(item), index);
    return map;
  }, new Map<unknown, number>());
}
