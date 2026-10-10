import { createUtcDate } from '../createUtcDate';

/**
 * 指定された日付型の値のローカル日時と同じUTC日時の日付型を作成する。
 * @param date 日付型の値
 * @returns
 */
export default function asUtcDate(date: Date): Date {
  return createUtcDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
}
