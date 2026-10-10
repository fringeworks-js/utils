import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * hello world -> hello-world
 * @param data
 * @returns
 */
const recaseKebab = (data: string) => _recaseKebab(data);
recaseKebab.dataLast = () => (data: string) => _recaseKebab(data);
export default recaseKebab;

function _recaseKebab(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toKebabCase(data);
}
