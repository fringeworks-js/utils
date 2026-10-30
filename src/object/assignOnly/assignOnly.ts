import type { StrictRecord } from '@fringeworks/types';
import type {
  AssignOnlyCondition,
  AssignOnlyKeysResult,
  AssignOnlyResult,
} from '../assignOnlyMutable';
import { assignOnlyMutable } from '../assignOnlyMutable';
import type { AssignOnlyOptions } from './types';

/**
 * valuesの値のうち、条件に合うものだけをtargetへ適用した新しいオブジェクトを返す（非破壊的変更）
 * @param target 適用先のオブジェクト
 * @param values 適用する値を持ったオブジェクト
 * @param condition 条件。キー・キーの配列・正規表現（キーと照合する）・関数（値・キー・targetの今の値を受け取る）
 * @param options オプション
 * @returns 値を適用した新しいオブジェクト
 */
export default function assignOnly<
  T extends object,
  V extends object,
  K extends keyof V,
>(
  target: T,
  values: V,
  condition: K | readonly K[],
  options?: AssignOnlyOptions,
): AssignOnlyKeysResult<T, V, K>;
export default function assignOnly<T extends object, V extends object>(
  target: T,
  values: V,
  condition: AssignOnlyCondition<V>,
  options?: AssignOnlyOptions,
): AssignOnlyResult<T, V>;
export default function assignOnly(
  target: object,
  values: object,
  condition: AssignOnlyCondition<StrictRecord>,
  options: AssignOnlyOptions = {},
): object {
  return assignOnlyMutable(
    { ...target },
    values as StrictRecord,
    condition,
    options,
  );
}
