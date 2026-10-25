import { createUtcDate } from '../createUtcDate';

/**
 * 指定された日付型の値のローカル日時と同じUTC日時の日付型を作成する。
 * @param value 日付型の値
 * @returns
 */
export default function asUtcDate(value: Date): Date {
  return createUtcDate(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    value.getHours(),
    value.getMinutes(),
    value.getSeconds(),
    value.getMilliseconds(),
  );
}
