/**
 * 値が空の配列・`Map`・`Set` であるか判定する。\
 * `null`・`undefined` やそれ以外の値は false
 * @param value 判定する値
 * @returns 空の配列・`Map`・`Set` であれば true
 */
export default function isEmptyCollection(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Set || value instanceof Map) {
    return value.size === 0;
  }
  return false;
}
