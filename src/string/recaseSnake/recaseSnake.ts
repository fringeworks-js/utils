import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * hello world -> hello_world
 * @param data
 * @returns
 */
const recaseSnake = (data: string) => _recaseSnake(data);
recaseSnake.dataLast = () => (data: string) => _recaseSnake(data);
export default recaseSnake;

function _recaseSnake(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toSnakeCase(data);
}
