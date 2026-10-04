import type { LooseRecord } from '@fringeworks/types';
import * as R from 'remeda';
import type {
  DistributeOptions,
  DistributeResult,
  DistributeRules,
} from './types';

/**
 * object直下のプロパティをrulesに従って分配する
 * @param data
 * @param rules
 * @param options
 */
const distribute = <T extends LooseRecord, DR extends DistributeRules<T>>(
  data: T,
  rules: DR,
  options: DistributeOptions = {},
): DistributeResult<T, DR> => _distribute(data, rules, options);
distribute.dataLast =
  <T extends LooseRecord, DR extends DistributeRules<T>>(
    rules: DR,
    options: DistributeOptions = {},
  ) =>
  (data: T): DistributeResult<T, DR> =>
    _distribute(data, rules, options);
export default distribute;

function _distribute<T extends LooseRecord, DR extends DistributeRules<T>>(
  data: T,
  rules: DR,
  options: DistributeOptions = {},
): DistributeResult<T, DR> {
  const { includeInherited, cloneValue } = options;
  const has = includeInherited
    ? (property) => property in data
    : (property) => Object.hasOwn(data, property);
  const get = cloneValue
    ? (property) => R.clone(data[property])
    : (property) => data[property];
  // 分配結果
  const result: Record<string, Record<PropertyKey, unknown>> = {};
  // 対象をrestにコピーし、分配できたものはrestから削除していく
  const rest = { ...data };
  const restGroupKeys: string[] = [];

  for (const groupKey in rules) {
    const group: LooseRecord = (result[groupKey] = {});
    const properties = rules[groupKey];
    if (properties == null) {
      // 分配できなかったプロパティを設定するグループ
      restGroupKeys.push(groupKey);
    } else {
      // 指定のプロパティを対象のグループへ分配
      for (const property of properties) {
        if (has(property)) {
          group[property] = get(property);
          delete rest[property];
        }
      }
    }
  }
  if (restGroupKeys.length) {
    for (const groupKey of restGroupKeys) {
      // restの内容をグループへ設定
      result[groupKey] = { ...rest };
    }
  }

  return result as DistributeResult<T, DR>;
}
