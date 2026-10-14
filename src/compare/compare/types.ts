/**
 * 部分文字列・要素を含むかを調べる対象（文字列または配列）
 */
type Container = string | readonly unknown[];

/**
 * 演算子ごとの左辺の値の型
 *
 * 大小の比較は値の型を問わず（数値・文字列・Date など）、
 * JavaScript の比較演算子の挙動に任せる
 */
export type CompareLeft = {
  '===': unknown;
  '!==': unknown;
  '==': unknown;
  '!=': unknown;
  '>': unknown;
  '>=': unknown;
  '<': unknown;
  '<=': unknown;
  deepEqual: unknown;
  notDeepEqual: unknown;
  between: unknown;
  notBetween: unknown;
  oneOf: unknown;
  notOneOf: unknown;
  includes: Container;
  notIncludes: Container;
  includesAll: Container;
  includesAny: Container;
  startsWith: string;
  endsWith: string;
  matches: string;
};

/**
 * 演算子ごとの右辺の値の型
 */
export type CompareRight = {
  '===': unknown;
  '!==': unknown;
  '==': unknown;
  '!=': unknown;
  '>': unknown;
  '>=': unknown;
  '<': unknown;
  '<=': unknown;
  deepEqual: unknown;
  notDeepEqual: unknown;
  /** 範囲（閉区間 [min, max]） */
  between: readonly [unknown, unknown];
  /** 範囲（閉区間 [min, max]） */
  notBetween: readonly [unknown, unknown];
  /** 候補の配列 */
  oneOf: readonly unknown[];
  /** 候補の配列 */
  notOneOf: readonly unknown[];
  /** 部分文字列（左辺が文字列の場合）・要素（左辺が配列の場合） */
  includes: unknown;
  /** 部分文字列（左辺が文字列の場合）・要素（左辺が配列の場合） */
  notIncludes: unknown;
  /** 部分文字列・要素の配列 */
  includesAll: readonly unknown[];
  /** 部分文字列・要素の配列 */
  includesAny: readonly unknown[];
  startsWith: string;
  endsWith: string;
  /** 正規表現（文字列の場合は RegExp に変換する） */
  matches: RegExp | string;
};
