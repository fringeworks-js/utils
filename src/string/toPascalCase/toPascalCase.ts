import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';
import { upperFirst } from '../upperFirst';

/**
 * hello world -> HelloWorld
 * @param data
 * @returns
 */
const toPascalCase = (data: string) => _toPascalCase(data);
toPascalCase.dataLast = () => (data: string) => _toPascalCase(data);
export default toPascalCase;

function _toPascalCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return upperFirst(
    R.toCamelCase(_normalizeSeparators(data), {
      preserveConsecutiveUppercase: false,
    }),
  );
}
