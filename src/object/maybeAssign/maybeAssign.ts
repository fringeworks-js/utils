import type { LooseRecord } from '@fringeworks/types';
import maybeAssignMutable from '../maybeAssignMutable';
import type { MaybeAssignOptions } from './types';

/**
 * valuesにあるundefinedでない値のみtargetへ適用する
 * @param target
 * @param values
 * @param options
 * @returns
 */
const maybeAssign = <T extends LooseRecord, V extends LooseRecord>(
  target: T,
  values: V,
  options: MaybeAssignOptions = {},
): T & V => _maybeAssign(target, values, options);
maybeAssign.dataLast =
  <V extends LooseRecord>(values: V, options: MaybeAssignOptions = {}) =>
  <T extends LooseRecord>(target: T): T & V =>
    _maybeAssign(target, values, options);
export default maybeAssign;

function _maybeAssign<T extends LooseRecord, V extends LooseRecord>(
  target: T,
  values: V,
  options: MaybeAssignOptions = {},
): T & V {
  if (target && values) {
    return maybeAssignMutable({ ...target }, values, options);
  }
  return target as T & V;
}
