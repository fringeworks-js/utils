/**
 * 置換前の文字列をキー、置換後の文字列を値に持つマップ\
 * Map のほか、プロパティをエントリーにするオブジェクトや、エントリーの配列も受け付ける
 */
export type ReplacementMap =
  | ReadonlyMap<string, string>
  | Record<string, string>
  | Iterable<readonly [string, string]>;

/**
 * 文字列を置換する関数
 */
export type Replacer = (str: string) => string;
