import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * Hello World -> HELLO WORLD
 * @param data
 * @returns
 */
const toUpperCase = (data: string) => _toUpperCase(data);
toUpperCase.dataLast = () => (data: string) => _toUpperCase(data);
export default toUpperCase;

function _toUpperCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toUpperCase(data);
}
