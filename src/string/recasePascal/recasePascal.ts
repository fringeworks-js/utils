import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';
import { upperFirst } from '../upperFirst';

/**
 * hello world -> HelloWorld
 * @param data
 * @returns
 */
const recasePascal = (data: string) => _recasePascal(data);
recasePascal.dataLast = () => (data: string) => _recasePascal(data);
export default recasePascal;

function _recasePascal(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return upperFirst(R.toCamelCase(data));
}
