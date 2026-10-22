/**
 * 型レベルで配列内の全タプルを反転させる
 * 新しい配列を返すため、readonly の配列を渡しても書き換えられる配列の型にする
 */
export type SwapPairsResult<T> = {
  // 配列（または readonly 配列）の各要素について処理
  -readonly [K in keyof T]: T[K] extends readonly [infer A, infer B]
    ? [B, A]
    : T[K];
};
