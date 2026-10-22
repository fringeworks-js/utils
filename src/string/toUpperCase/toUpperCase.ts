/**
 * 文字列全体を大文字に変換する（`'Hello World'` → `'HELLO WORLD'`）\
 * 単語は区切らない。ケース変換の関数を一覧から探せるように用意している
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns 大文字に変換した文字列
 */
export default function toUpperCase(data: string): string {
  if (!data) {
    return data;
  }
  return data.toUpperCase();
}
