import type { CompareMode } from './constants';

/**
 * isEqual関数のオプション
 */
export type IsEqualOptions = {
  /**
   * 比較方法
   * - 'strict': 値1 === 値2
   * - 'loose': 値1 == 値2
   * - 'deep': 値1 と 値2 の構造が同じであること
   * @default 'strict'
   */
  mode?: CompareMode;

  /**
   * 独自の比較関数
   * - mode='deep'の場合: isEqualWithのcustomizerとして使う
   * - mode='deep'以外の場合: value1、value2のみ渡される。boolean以外の値を返した場合は通常の比較を行う
   * @param value1
   * @param value2
   * @param indexOrKey
   * @param value1Parent
   * @param value2Parent
   * @returns
   */
  customizer?: (
    value1: unknown,
    value2: unknown,
    indexOrKey?: PropertyKey | undefined,
    value1Parent?: unknown,
    value2Parent?: unknown,
  ) => boolean | undefined;
};
