import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * hello world -> HELLO_WORLD
 * @param data
 * @returns
 */
const recaseScreamingSnake = (data: string) => _recaseScreamingSnake(data);
recaseScreamingSnake.dataLast = () => (data: string) =>
  _recaseScreamingSnake(data);
export default recaseScreamingSnake;

function _recaseScreamingSnake(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toSnakeCase(data).toUpperCase();
}
