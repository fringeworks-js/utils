import { escapeRegExp } from '../escapeRegExp';
import { maybeMatchAll } from '../maybeMatchAll';
import type { CreateExtractorResult, ExtractorOptions } from './types';

/**
 * 特定のデリミタで囲まれたトークンを抽出する関数を作成する
 * @param delimiters 開始・終了の囲み文字。単一の文字列の場合は開始・終了共通
 * @returns
 */
export default function createExtractor(
  delimiters: string | [string, string] = ['{{', '}}'],
): CreateExtractorResult {
  const [prefix, suffix] = Array.isArray(delimiters)
    ? delimiters
    : [delimiters, delimiters];

  const escapedPrefix = escapeRegExp(prefix);
  const escapedSuffix = escapeRegExp(suffix);

  // 最短一致 (.*?) を使用して、中身をキャプチャグループ ( ) で囲む
  const pattern = `${escapedPrefix}(.*?)${escapedSuffix}`;
  const regex = new RegExp(pattern, 'g');

  const extractor = (str: string, options: ExtractorOptions = {}): string[] => {
    const { keepDelimiters, trim, unique } = options;

    const matches = maybeMatchAll(str, regex);

    if (matches.length === 0) {
      return [];
    }

    let results = matches.map((match) => {
      // - match[0]: 全体
      // - match[1]: 中身
      const token = keepDelimiters ? match[0] : match[1];
      return trim ? token.trim() : token;
    });

    if (unique) {
      results = Array.from(new Set(results));
    }

    return results;
  };

  extractor.prefix = prefix;
  extractor.suffix = suffix;
  return extractor;
}
