import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import _normalizeSeparators from '../_internal/_normalizeSeparators';
import { upperFirst } from '../upperFirst';

/**
 * hello world -> Hello-World
 * @param data
 * @returns
 */
const toTrainCase = (data: string) => _toTrainCase(data);
toTrainCase.dataLast = () => (data: string) => _toTrainCase(data);
export default toTrainCase;

function _toTrainCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toKebabCase(_normalizeSeparators(data))
    .split('-')
    .map(upperFirst)
    .join('-');
}
