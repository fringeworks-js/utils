import { rotateArrayMutable } from '../rotateArrayMutable';
import type { RotateArrayOptions } from './types';

/**
 * 配列の前方の要素を末尾に移動した新しい配列を返す
 * @param data 対象の配列
 * @param options オプション
 * @returns ローテーションした新しい配列
 */
const rotateArray = <I>(data: I[], options?: RotateArrayOptions) =>
  _rotateArray(data, options);
rotateArray.dataLast =
  (options?: RotateArrayOptions) =>
  <I>(data: I[]) =>
    _rotateArray(data, options);
export default rotateArray;

function _rotateArray<I>(data: I[], options?: RotateArrayOptions): I[] {
  return data ? rotateArrayMutable([...data], options) : data;
}
