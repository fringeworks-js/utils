import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> hello-world
 * @param data
 * @returns
 */
const toKebabCase = (data: string) => _toKebabCase(data);
toKebabCase.dataLast = () => (data: string) => _toKebabCase(data);
export default toKebabCase;

function _toKebabCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toKebabCase(_normalizeSeparators(data));
}
