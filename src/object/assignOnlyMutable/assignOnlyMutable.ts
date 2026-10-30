import type { StrictRecord } from '@fringeworks/types';
import _assignValues from '../../_internal/_assignValues';
import { isRegExp } from '../../type/isRegExp';
import type {
  AssignOnlyCondition,
  AssignOnlyKeysResult,
  AssignOnlyMutableOptions,
  AssignOnlyResult,
} from './types';

/**
 * valuesの値のうち、条件に合うものだけをtargetへ適用する（破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param condition 条件。キー・キーの配列・正規表現（キーと照合する）・関数（値・キー・targetの今の値を受け取る）
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
  if (isRegExp(condition)) {
    // search は lastIndex を使わないため、g フラグ付きの正規表現でも結果が変わらない
    return (_value, key) =>
      typeof key === 'string' && key.search(condition) !== -1;
  }
  const keys = new Set(
    (Array.isArray(condition) ? condition : [condition]).map(_toKey),
  );
  return (_value, key) => keys.has(key);
}

/**
 * プロパティのキーとして比べられる形にする（数値は文字列にする）
 */
function _toKey(key: PropertyKey): string | symbol {
  return typeof key === 'number' ? String(key) : key;
}
