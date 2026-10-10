import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * Hello World -> HELLO WORLD
 * @param data
 * @returns
 */
const recaseUpper = (data: string) => _recaseUpper(data);
recaseUpper.dataLast = () => (data: string) => _recaseUpper(data);
export default recaseUpper;

function _recaseUpper(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toUpperCase(data);
}
