/**
 * 数値であることを保証する\
 * null や undefined や NaN や数値に変換できない値は0に変換される
 *
 * @param data 任意の値 or null or undefined
 * @returns 数値
 */
const ensureNumber = (data: unknown | null | undefined): number =>
  _ensureNumber(data);
ensureNumber.dataLast = () => ensureNumber;
export default ensureNumber;

function _ensureNumber(target: unknown | null | undefined): number {
  if (typeof target === 'number') {
    return Number.isNaN(target) ? 0 : target;
  } else if (target == null) {
    return 0;
  } else if (typeof target === 'string') {
    const num = Number(target);
    if (isNaN(num)) {
      return 0;
    } else {
      return num;
    }
  } else {
    return 0;
  }
}
