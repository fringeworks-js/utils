import type { IsBlankOptions } from './types';

const REGEX_FULL_WHITESPACE = /\u3000/g;
const REGEX_BOTH_WHITESPACE = /[ \u3000]/g;
const REGEX_ALL_WHITESPACE = /\s/g;

/**
 * 値が空であるか判定する
 * @param value
 * @param options
 * @returns
 */
export default function isBlank(
  value: unknown,
  options: IsBlankOptions = {},
): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value === 'string') {
    const { trimType = 'none' } = options;
    let processed = value;
    switch (trimType) {
      case 'none':
        break;
      case 'half':
        processed = processed.replace(/^[ \t\n\v\f\r]+|[ \t\n\v\f\r]+$/g, '');
        break;
      case 'full':
        processed = processed.replace(REGEX_FULL_WHITESPACE, '');
        break;
      case 'both':
        processed = processed.replace(REGEX_BOTH_WHITESPACE, '');
        break;
      case 'all':
        processed = processed.replace(REGEX_ALL_WHITESPACE, '');
        break;
    }
    return processed === '';
  }
  return false;
}
