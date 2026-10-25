/**
 * number型の値であることを保証する\
 * 数値はそのまま返し（NaNは0）、文字列はNumber()で変換する（変換できない場合は0）。
 * それ以外の値（null、undefined、真偽値、bigint、オブジェクトなど）は0になる。
 * Infinity・-Infinityはそのまま返すため、有限の数だけを扱う場合はgetValidNumberを使う
 *
 * @param data 任意の値
 * @returns 数値
 */
export default function ensureNumber(data: unknown): number {
  if (typeof data === 'number') {
    return Number.isNaN(data) ? 0 : data;
  } else if (typeof data === 'string') {
    const num = Number(data);
    return Number.isNaN(num) ? 0 : num;
  }
  return 0;
}
