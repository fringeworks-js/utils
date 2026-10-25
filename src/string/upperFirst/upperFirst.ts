/**
 * 先頭の文字を大文字に変換する\
 * サロゲートペアの文字も1文字として扱う
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns 先頭の文字を大文字にした文字列
 */
export default function upperFirst(data: string): string {
  if (!data) {
    return data;
  }
  const length = data.codePointAt(0)! > 0xffff ? 2 : 1;
  return data.slice(0, length).toUpperCase() + data.slice(length);
}
