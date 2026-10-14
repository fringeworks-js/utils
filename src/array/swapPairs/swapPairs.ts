import type { SwapPairsResult } from './types';

/**
 * タプルの配列を受け取り、各要素の [0] と [1] を入れ替える
 * @param pairs タプルの配列。null・undefinedは空配列として扱う
 */
export default function swapPairs<const T extends [unknown, unknown][]>(
  pairs: T | null | undefined,
): SwapPairsResult<T> {
  return (pairs ?? []).map(([first, second]) => [
    second,
    first,
  ]) as SwapPairsResult<T>;
}
