import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> HELLO_WORLD
 * @param data
 * @returns
 */
const toScreamingSnakeCase = (data: string) => _toScreamingSnakeCase(data);
toScreamingSnakeCase.dataLast = () => (data: string) =>
  _toScreamingSnakeCase(data);
export default toScreamingSnakeCase;

function _toScreamingSnakeCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toSnakeCase(_normalizeSeparators(data)).toUpperCase();
}
