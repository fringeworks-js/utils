/**
 * 正しい日付の `Date` かどうかを判定する。\
 * 不正な日付の `Date`、および `Date` 以外は false。\
 * 不正な日付の `Date` も false になるため、型ガードにはしていない
 * @param value 判定する値
 * @returns 正しい日付の `Date` であれば true
 */
export default function isValidDate(value: unknown): boolean {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
