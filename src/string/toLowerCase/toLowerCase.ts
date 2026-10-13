import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * Hello World -> hello world
 * @param data
 * @returns
 */
const toLowerCase = (data: string) => _toLowerCase(data);
toLowerCase.dataLast = () => (data: string) => _toLowerCase(data);
export default toLowerCase;

function _toLowerCase(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toLowerCase(data);
}
