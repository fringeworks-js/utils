import _splitWords from '../_internal/_splitWords';

/**
 * 文字列をスクリーミングスネークケースに変換する（`'hello world'` → `'HELLO_WORLD'`）\
 * 単語の区切り方は README の「ケース変換」を参照
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns スクリーミングスネークケースに変換した文字列
 */
export default function toScreamingSnakeCase(data: string): string {
  if (!data) {
    return data;
  }
  return _splitWords(data).join('_').toUpperCase();
}
