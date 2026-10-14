/**
 * number型の値であることを保証する\
 * 数値はそのまま返し（NaNは0）、文字列はNumber()で変換する（変換できない場合は0）。
 * それ以外の値（null、undefined、真偽値、bigint、オブジェクトなど）は0になる。
 * Infinity・-Infinityはそのまま返すため、有限の数だけを扱う場合はgetValidNumberを使う
 *
 * @param data 任意の値
 * @returns 数値
 */
export default function ensureNumber(target: unknown): number {
  if (typeof target === 'number') {
    return Number.isNaN(target) ? 0 : target;
  } else if (typeof target === 'string') {
    const num = Number(target);
    return Number.isNaN(num) ? 0 : num;
  }
  return 0;
}
