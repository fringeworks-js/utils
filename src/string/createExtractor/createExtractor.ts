import _createDelimiterPattern from '../_internal/_createDelimiterPattern';
import type { Extractor, ExtractorOptions } from './types';

/**
 * 囲み文字で囲まれた部分を抽出する関数を作る\
 * 囲み文字の内側は改行を含まない。前後の空白は、オプションで指定しない限り削除する
 * @param delimiters 開始・終了の囲み文字。1つの文字列の場合は開始・終了で共通にする。
 * 省略した場合や空文字の場合は `['{{', '}}']`
 * @returns 抽出する関数
 */
export default function createExtractor(
  delimiters?: string | readonly [string, string],
): Extractor {
  const { prefix, suffix, pattern } = _createDelimiterPattern(delimiters);

  const extractor = (str: string, options: ExtractorOptions = {}): string[] => {
    if (!str) {
      return [];
    }
    const {
      keepDelimiters = false,
      keepWhitespace = false,
      unique = false,
    } = options;

    const results: string[] = [];
    for (const match of str.matchAll(pattern)) {
      // match[0] は囲み文字を含む全体、match[1] は内側
      const content = match[1]!;
      results.push(
        keepDelimiters ? match[0] : keepWhitespace ? content : content.trim(),
      );
    }
    return unique ? Array.from(new Set(results)) : results;
  };

  return Object.assign(extractor, { prefix, suffix });
}
