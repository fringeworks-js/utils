import _splitWords from '../_internal/_splitWords';
import { upperFirst } from '../upperFirst';

/**
 * 文字列をトレインケースに変換する（`'hello world'` → `'Hello-World'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns トレインケースに変換した文字列
 */
export default function toTrainCase(data: string): string {
  if (!data) {
    return data;
  }
  return _splitWords(data)
    .map((word) => upperFirst(word.toLowerCase()))
    .join('-');
}
