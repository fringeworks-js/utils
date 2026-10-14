/**
 * 不正な日付（`Invalid Date`）の `Date` かどうかを判定する。\
 * 正しい日付の `Date`、および `Date` 以外は false
 * @param value 判定する値
 * @returns 不正な日付の `Date` であれば true
 */
export default function isInvalidDate(value: unknown): boolean {
  return value instanceof Date && Number.isNaN(value.getTime());
}
