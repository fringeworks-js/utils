import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> hello.world
 * @param data
 * @returns
 */
const toDotCase = (data: string) => _toDotCase(data);
toDotCase.dataLast = () => (data: string) => _toDotCase(data);
export default toDotCase;

function _toDotCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toSnakeCase(_normalizeSeparators(data)).replaceAll('_', '.');
}
