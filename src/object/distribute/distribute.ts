import type { StrictRecord } from '@fringeworks/types';
import _isEnumerable from '../../_internal/_isEnumerable';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { cloneDeep } from '../cloneDeep';
import { hasOwn } from '../hasOwn';
import type {
  DistributeOptions,
  DistributeResult,
  DistributeRules,
} from './types';

/**
 * object直下のプロパティをrulesに従って分配する
 * 同じプロパティを複数のグループに指定した場合は、それぞれのグループに分配する
 * @param data 分配するオブジェクト
 * @param rules 分配のルール
 * @param options オプション
 */
export default function distribute<
  T extends object,
  DR extends DistributeRules<T>,
>(
  data: T,
  rules: DR,
  options: DistributeOptions = {},
): DistributeResult<T, DR> {
  const { includeInherited, cloneValue } = options;
  const record = data as StrictRecord;
  const has = includeInherited
    ? (property: PropertyKey) => property in data
    : (property: PropertyKey) => hasOwn(data, property);
  const copy = cloneValue ? cloneDeep : (value: unknown) => value;
  // 分配結果
  const result: Record<string, StrictRecord> = {};
  // 分配したプロパティ
  const distributed = new Set<PropertyKey>();
  // 分配できなかったプロパティを設定するグループ
  const restGroups: StrictRecord[] = [];

  for (const groupKey in rules) {
    const group: StrictRecord = (result[groupKey] = {});
    const properties = rules[groupKey];
    if (properties == null) {
      restGroups.push(group);
    } else {
      // 指定のプロパティを対象のグループへ分配
      for (const property of properties) {
        if (!_isUnsafeKey(property) && has(property)) {
          group[property] = copy(record[property]);
          distributed.add(property);
        }
      }
    }
  }

  if (restGroups.length) {
    // 自身の列挙可能なプロパティのうち、分配していないものを各グループへ設定
    // `Reflect.ownKeys`より速いため、文字列とsymbolのキーを分けて列挙する
    const setRest = (key: PropertyKey) => {
      if (_isUnsafeKey(key) || distributed.has(key)) {
        return;
      }
      const value = record[key];
      for (const group of restGroups) {
        group[key] = copy(value);
      }
    };
    for (const key of Object.keys(record)) {
      setRest(key);
    }
    for (const key of Object.getOwnPropertySymbols(record)) {
      if (_isEnumerable(record, key)) {
        setRest(key);
      }
    }
  }

  return result as DistributeResult<T, DR>;
}
