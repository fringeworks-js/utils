import { isEmptyValue } from '../../type/isEmptyValue';

/**
 * 指定のサイズになるまで、引数の配列を繰り返した新しい配列を返す。
 * @param data
 * @param length
 */
const repeatToLength = <T>(data: T[], length: number): T[] =>
  _repeatToLength(data, length);
repeatToLength.dataLast =
  (length: number) =>
  <T>(data: T[]): T[] =>
    _repeatToLength(data, length);
export default repeatToLength;

function _repeatToLength<T>(data: T[], length: number): T[] {
  if (length === 0 || isEmptyValue(data)) {
    return [];
  }

  const result = new Array(Math.abs(length));
  // sizeが負の場合は逆順
  const source = length < 0 ? [...data].reverse() : data;
  // 整数回繰り返す回数
  const cycles = Math.floor(result.length / source.length);
  // 残りの要素数
  const remainder = result.length % source.length;

  // 1配列分を回数分追加
  for (let i = 0; i < cycles; i++) {
    result.splice(i * source.length, source.length, ...source);
  }

  // 残りの要素を追加
  if (remainder > 0) {
    result.splice(
      cycles * source.length,
      remainder,
      ...source.slice(0, remainder),
    );
  }

  return result;
}
