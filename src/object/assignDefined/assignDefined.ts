import type { LooseRecord } from '@fringeworks/types';
import { assignDefinedMutable } from '../assignDefinedMutable';
import type { AssignDefinedOptions } from './types';

/**
 * valuesにあるundefinedでない値のみtargetへ適用する
 * @param target
 * @param values
 * @param options
 * @returns
 */
const assignDefined = <T extends LooseRecord, V extends LooseRecord>(
  target: T,
  values: V,
  options: AssignDefinedOptions = {},
): T & V => _assignDefined(target, values, options);
assignDefined.dataLast =
  <V extends LooseRecord>(values: V, options: AssignDefinedOptions = {}) =>
  <T extends LooseRecord>(target: T): T & V =>
    _assignDefined(target, values, options);
export default assignDefined;

function _assignDefined<T extends LooseRecord, V extends LooseRecord>(
  target: T,
  values: V,
  options: AssignDefinedOptions = {},
): T & V {
  if (target && values) {
    return assignDefinedMutable({ ...target }, values, options);
  }
  return target as T & V;
}
