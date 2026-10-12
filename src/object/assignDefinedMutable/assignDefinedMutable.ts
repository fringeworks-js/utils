import type { LooseRecord } from '@fringeworks/types';
import { forEachValue } from '../forEachValue';
import type { AssignDefinedMutableOptions, AssignDefinedResult } from './types';

/**
 * valuesにあるundefinedでない値のみtargetへ適用する
 * @param target
 * @param values
 * @param options
 * @returns
 */
export default function assignDefinedMutable<
  T extends LooseRecord,
  V extends LooseRecord,
>(
  target: T,
  values: V,
  options: AssignDefinedMutableOptions = {},
): AssignDefinedResult<T, V> {
  if (target && values) {
    const { skipNull, ...opts } = options;
    const isValidValue = skipNull
      ? (value: unknown) => value != null
      : (value: unknown) => value !== undefined;
    forEachValue(
      values,
      (value, key) => {
        if (isValidValue(value)) {
          (target as LooseRecord)[key] = value;
        }
      },
      opts,
    );
  }
  return target as AssignDefinedResult<T, V>;
}
