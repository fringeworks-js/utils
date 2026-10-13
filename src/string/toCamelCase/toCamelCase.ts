import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> helloWorld
 * @param data
 * @returns
 */
const toCamelCase = (data: string) => _toCamelCase(data);
toCamelCase.dataLast = () => (data: string) => _toCamelCase(data);
export default toCamelCase;

function _toCamelCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toCamelCase(_normalizeSeparators(data), {
    preserveConsecutiveUppercase: false,
  });
}
