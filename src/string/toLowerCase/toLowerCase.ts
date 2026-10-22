/**
 * 文字列全体を小文字に変換する（`'Hello World'` → `'hello world'`）\
 * 単語は区切らない。ケース変換の関数を一覧から探せるように用意している
 * @param data 対象の文字列。空文字はそのまま返す
 * @returns 小文字に変換した文字列
 */
export default function toLowerCase(data: string): string {
  if (!data) {
    return data;
  }
  return data.toLowerCase();
}
