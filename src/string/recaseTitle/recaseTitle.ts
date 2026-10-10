import * as R from 'remeda';
import { isBlank } from '../../type/isBlank';

/**
 * hello world -> Hello World
 * @param data
 * @returns
 */
const recaseTitle = (data: string) => _recaseTitle(data);
recaseTitle.dataLast = () => (data: string) => _recaseTitle(data);
export default recaseTitle;

function _recaseTitle(data: string): string {
  if (isBlank(data)) {
    return data;
  }
  return R.toTitleCase(data);
}
