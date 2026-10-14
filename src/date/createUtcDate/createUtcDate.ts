/**
 * UTCの日時を指定してDate型のインスタンスを作成する\
 * `Date.UTC` と異なり、0〜99 の年もそのままの年として扱う
 * @param year UTC年
 * @param month UTC月(0～11)
 * @param date UTC日
 * @param hours UTC時
 * @param minutes UTC分
 * @param seconds UTC秒
 * @param milliseconds UTCミリ秒
 * @returns
 */
export default function createUtcDate(
  year: number,
  month: number = 0,
  date: number = 1,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0,
  milliseconds: number = 0,
): Date {
  // Date.UTC は 0〜99 年を 1900 年代として扱うため、各値を個別に設定する
  const result = new Date(0);
  result.setUTCFullYear(year, month, date);
  result.setUTCHours(hours, minutes, seconds, milliseconds);
  return result;
}
