import _splitWords from '../_internal/_splitWords';

/**
 * 文字列をフラットケースに変換する（`'hello world'` → `'helloworld'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字・null・undefined はそのまま返す
 * @returns フラットケースに変換した文字列
 */
export default function toFlatCase(data: string): string {
  if (!data) {
    return data;
  }
  return _splitWords(data).join('').toLowerCase();
}
