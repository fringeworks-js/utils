import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';
import { upperFirst } from '../upperFirst';

/**
 * hello world -> Hello world
 * @param data
 * @returns
 */
const toSentenceCase = (data: string) => _toSentenceCase(data);
toSentenceCase.dataLast = () => (data: string) => _toSentenceCase(data);
export default toSentenceCase;

function _toSentenceCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return upperFirst(
    R.toSnakeCase(_normalizeSeparators(data)).replaceAll('_', ' '),
  );
}
