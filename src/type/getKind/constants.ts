/**
 * 型種別。\
 * `typeof` の結果のうち `'object'` を除いたものに、オブジェクトの詳細な種別を加えたもの
 */
export const Kind = {
  /**
   * undefined
   */
  undefined: 'undefined',

  /**
   * 真偽値
   */
  boolean: 'boolean',

  /**
   * 数値
   */
  number: 'number',

  /**
   * BigInt
   */
  bigint: 'bigint',

  /**
   * 文字列
   */
  string: 'string',

  /**
   * シンボル
   */
  symbol: 'symbol',

  /**
   * 関数
   */
  function: 'function',

  /**
   * null
   */
  null: 'null',

  /**
   * 配列
   */
  array: 'array',

  /**
   * 単純なオブジェクト（プロトタイプが `Object.prototype` または `null`）
   */
  plainobject: 'plainobject',

  /**
   * 日付
   */
  date: 'date',

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
   * 上記のどれにも当たらないオブジェクト（クラスのインスタンス、DOM、TypedArray など）
   */
  instance: 'instance',
} as const;

/**
 * 型種別
 */
export type Kind = (typeof Kind)[keyof typeof Kind];
