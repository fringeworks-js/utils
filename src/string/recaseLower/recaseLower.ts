import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * Hello World -> hello world
 * @param data
 * @returns
 */
const recaseLower = (data: string) => _recaseLower(data);
recaseLower.dataLast = () => (data: string) => _recaseLower(data);
export default recaseLower;

function _recaseLower(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toLowerCase(data);
}
