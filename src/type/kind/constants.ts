import { TypeOfResult } from '@fringeworks/constants';

/**
 * 型種別
 */
export const KindType = {
  ...TypeOfResult,

  /**
   * null
   */
  null: 'null',

  /**
   * 日付
   */
  date: 'date',

  /**
   * 配列
   */
  array: 'array',

  /**
   * 単純なオブジェクト
   */
  plainobject: 'plainobject',

  /**
   * 正規表現
   */
  regexp: 'regexp',

  /**
   * エラーオブジェクト
   */
  error: 'error',

  /**
   * Map
   */
  map: 'map',

  /**
   * Set
   */
  set: 'set',

  /**
   * WeakMap
   */
  weakmap: 'weakmap',

  /**
   * WeakSet
   */
  weakset: 'weakset',

  /**
   * Promise
   */
  promise: 'promise',

  /**
   * ArrayBuffer
   */
  arraybuffer: 'arraybuffer',

  /**
   * SharedArrayBuffer
   */
  sharedarraybuffer: 'sharedarraybuffer',

  /**
   * 任意の型
   */
  any: 'any',
} as const;

/**
 * 型種別
 */
export type KindType = (typeof KindType)[keyof typeof KindType];
