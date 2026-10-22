/**
 * 先頭の文字を大文字に変換する\
 * サロゲートペアの文字も1文字として扱う
 * @param str 対象の文字列。空文字はそのまま返す
 * @returns 先頭の文字を大文字にした文字列
 */
export default function upperFirst(str: string): string {
  if (!str) {
    return str;
  }
  const length = str.codePointAt(0)! > 0xffff ? 2 : 1;
  return str.slice(0, length).toUpperCase() + str.slice(length);
}
