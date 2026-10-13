import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> helloworld
 * @param data
 * @returns
 */
const toFlatCase = (data: string) => _toFlatCase(data);
toFlatCase.dataLast = () => (data: string) => _toFlatCase(data);
export default toFlatCase;

function _toFlatCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toSnakeCase(_normalizeSeparators(data)).replaceAll('_', '');
}
