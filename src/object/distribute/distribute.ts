import type { StrictRecord } from '@fringeworks/types';
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
  const result: Record<string, Record<PropertyKey, unknown>> = {};
  // 対象をrestにコピーし、分配できたものはrestから削除していく
  const rest = { ...record };
  const restGroupKeys: string[] = [];

  for (const groupKey in rules) {
    const group: StrictRecord = (result[groupKey] = {});
    const properties = rules[groupKey];
    if (properties == null) {
      // 分配できなかったプロパティを設定するグループ
      restGroupKeys.push(groupKey);
    } else {
      // 指定のプロパティを対象のグループへ分配
      for (const property of properties) {
        if (!_isUnsafeKey(property) && has(property)) {
          group[property] = copy(record[property]);
          delete rest[property];
        }
      }
    }
  }
  for (const groupKey of restGroupKeys) {
    // restの内容をグループへ設定
    const group: StrictRecord = {};
    for (const key of Reflect.ownKeys(rest)) {
      group[key] = copy(rest[key]);
    }
    result[groupKey] = group;
  }

  return result as DistributeResult<T, DR>;
}
