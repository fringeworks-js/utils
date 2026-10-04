import type { LooseRecord } from '@fringeworks/types';
import forEachValues from '../forEachValues';
import type { MaybeAssignMutableOptions } from './types';

/**
 * valuesにあるundefinedでない値のみtargetへ適用する
 * @param target
 * @param values
 * @param options
 * @returns
 */
export default function maybeAssignMutable<
  T extends LooseRecord,
  V extends LooseRecord,
>(target: T, values: V, options: MaybeAssignMutableOptions = {}): T & V {
  if (target && values) {
    const { skipNull, ...opts } = options;
    const isValidValue = skipNull
      ? (value) => value != null
      : (value) => value !== undefined;
    forEachValues(
      values,
      (value, key) => {
        if (isValidValue(value)) {
          (target as LooseRecord)[key] = value;
        }
      },
      opts,
    );
  }
  return target as T & V;
}
