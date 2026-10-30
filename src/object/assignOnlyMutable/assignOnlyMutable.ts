import type { StrictRecord } from '@fringeworks/types';
import _assignValues from '../../_internal/_assignValues';
import type { StringConditionItem } from '../../string/createStringMatcher';
import { createStringMatcher } from '../../string/createStringMatcher';
import type {
  AssignOnlyCondition,
  AssignOnlyConditionItem,
  AssignOnlyKeysResult,
  AssignOnlyMutableOptions,
  AssignOnlyResult,
} from './types';

/**
 * valuesの値のうち、条件に合うものだけをtargetへ適用する（破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param condition 条件。キー・正規表現・StringComparison（キーと照合する）とその配列、または関数（値・キー・targetの今の値を受け取る）
 * @param options オプション
 * @returns 値を適用した同じオブジェクト
 */
export default function assignOnlyMutable<
  T extends object,
  V extends object,
  K extends keyof V,
>(
  target: T,
  values: V,
  condition: K | readonly K[],
  options?: AssignOnlyMutableOptions,
): AssignOnlyKeysResult<T, V, K>;
export default function assignOnlyMutable<T extends object, V extends object>(
  target: T,
  values: V,
  condition: AssignOnlyCondition<V>,
  options?: AssignOnlyMutableOptions,
): AssignOnlyResult<T, V>;
export default function assignOnlyMutable(
  target: object,
  values: object,
  condition: AssignOnlyCondition<StrictRecord>,
  options: AssignOnlyMutableOptions = {},
): object {
  _assignValues(
    target,
    values,
    _createShouldAssign(target, condition),
    options,
  );
  return target;
}

function _createShouldAssign(
  target: object,
  condition: AssignOnlyCondition<StrictRecord>,
): (value: unknown, key: string | symbol) => boolean {
  if (typeof condition === 'function') {
    // targetの値は、条件が関数のときだけ読む（アクセサーを余計に呼ばないため）
    const record = target as StrictRecord;
    return (value, key) => condition(value, key, record[key]);
  }
  // symbol のキーは同じ symbol とだけ比べ、それ以外は文字列の条件として比べる
  const symbols = new Set<symbol>();
  const stringConditions: StringConditionItem[] = [];
  const items: readonly AssignOnlyConditionItem[] = Array.isArray(condition)
    ? condition
    : [condition as AssignOnlyConditionItem];
  for (const item of items) {
    if (typeof item === 'symbol') {
      symbols.add(item);
    } else {
      // オブジェクトのキーは文字列なので、数値は文字列にして完全一致で比べる
      stringConditions.push(typeof item === 'number' ? String(item) : item);
    }
  }
  const matchString = createStringMatcher(stringConditions);
  return (_value, key) =>
    typeof key === 'symbol' ? symbols.has(key) : matchString(key);
}
