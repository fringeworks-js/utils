import _splitWords from '../_internal/_splitWords';

/**
 * 文字列をドットケースに変換する（`'hello world'` → `'hello.world'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns ドットケースに変換した文字列
 */
export default function toDotCase(data: string): string {
  if (!data) {
    return data;
  }
  return _splitWords(data).join('.').toLowerCase();
}
