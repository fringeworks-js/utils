/**
 * 開発時だけ `console.warn` で警告する
 *
 * `process.env.NODE_ENV` が `'production'` のときは何もしない。
 * `process` が無い環境（バンドラーを通さないブラウザーなど）では常に警告する。
 * @param data `console.warn` に渡す値
 */
export default function warnInDevelopment(...data: unknown[]): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return;
  }
  console.warn(...data);
}
