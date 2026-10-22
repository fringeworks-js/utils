import _splitWords from '../_internal/_splitWords';
import { upperFirst } from '../upperFirst';

/**
 * 文字列をパスカルケースに変換する（`'hello world'` → `'HelloWorld'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns パスカルケースに変換した文字列
 */
export default function toPascalCase(data: string): string {
  if (!data) {
    return data;
  }
  return _splitWords(data)
    .map((word) => upperFirst(word.toLowerCase()))
    .join('');
}
