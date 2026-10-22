import type { SwapPairsResult } from './types';

/**
 * タプルの配列を受け取り、各要素の [0] と [1] を入れ替える
 * @param pairs タプルの配列（readonly の配列も可）。null・undefinedは空配列として扱う
 * @returns 入れ替えた新しい配列
 */
export default function swapPairs<
  const T extends readonly (readonly [unknown, unknown])[],
>(pairs: T | null | undefined): SwapPairsResult<T> {
  return (pairs ?? []).map(([first, second]) => [
    second,
    first,
  ]) as SwapPairsResult<T>;
}
