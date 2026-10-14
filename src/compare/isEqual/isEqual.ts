import { isEqualWith } from '../isEqualWith';

/**
 * 既定の比較を行う（isEqualWith の customizer として使う）
 */
const deferToDefault = () => undefined;

/**
 * 2つの値の構造が等しいかを深く比較する\
 * 比較の基準は `isEqualWith` の既定の比較と同じ
 * @param value1 比較する値1
 * @param value2 比較する値2
 * @returns 比較結果
 */
export default function isEqual(value1: unknown, value2: unknown): boolean {
  return isEqualWith(value1, value2, deferToDefault);
}
