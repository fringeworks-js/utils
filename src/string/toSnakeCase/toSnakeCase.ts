import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> hello_world
 * @param data
 * @returns
 */
const toSnakeCase = (data: string) => _toSnakeCase(data);
toSnakeCase.dataLast = () => (data: string) => _toSnakeCase(data);
export default toSnakeCase;

function _toSnakeCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toSnakeCase(_normalizeSeparators(data));
}
