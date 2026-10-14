import _splitWords from '../_internal/_splitWords';
import { upperFirst } from '../upperFirst';

/**
 * 文字列をタイトルケースに変換する（`'hello world'` → `'Hello World'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字・null・undefined はそのまま返す
 * @returns タイトルケースに変換した文字列
 */
export default function toTitleCase(data: string): string {
  if (!data) {
    return data;
  }
  return _splitWords(data)
    .map((word) => upperFirst(word.toLowerCase()))
    .join(' ');
}
