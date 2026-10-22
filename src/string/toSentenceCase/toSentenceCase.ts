import _splitWords from '../_internal/_splitWords';
import { upperFirst } from '../upperFirst';

/**
 * 文字列をセンテンスケースに変換する（`'hello world'` → `'Hello world'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns センテンスケースに変換した文字列
 */
export default function toSentenceCase(data: string): string {
  if (!data) {
    return data;
  }
  return upperFirst(_splitWords(data).join(' ').toLowerCase());
}
