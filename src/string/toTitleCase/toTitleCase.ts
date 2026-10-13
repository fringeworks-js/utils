import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';

/**
 * hello world -> Hello World
 * @param data
 * @returns
 */
const toTitleCase = (data: string) => _toTitleCase(data);
toTitleCase.dataLast = () => (data: string) => _toTitleCase(data);
export default toTitleCase;

function _toTitleCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toTitleCase(_normalizeSeparators(data));
}
