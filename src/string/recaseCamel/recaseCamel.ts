import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * hello world -> helloWorld
 * @param data
 * @returns
 */
const recaseCamel = (data: string) => _recaseCamel(data);
recaseCamel.dataLast = () => (data: string) => _recaseCamel(data);
export default recaseCamel;

function _recaseCamel(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toCamelCase(data);
}
