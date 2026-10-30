import { alwaysInput } from '../../function/alwaysInput';
import { isRegExp } from '../../type/isRegExp';
import type {
  CreateStringMatcherOptions,
  StringComparison,
  StringCondition,
  StringConditionItem,
  StringPredicate,
} from './types';

/**
 * 正規化した値（normalized）と、ignoreCase も当てた値（comparable）を受け取って判定する関数
 */
type _Matcher = (
  value: string,
  normalized: string,
  comparable: string,
) => boolean;

/**
 * 文字列が条件に合うかを判定する関数を作る\
 * 文字列は完全一致、RegExp は正規表現、StringComparison は部分一致などの比べ方、関数は戻り値で判定する。
 * 配列は、どれかに合うときに一致する（OR）
 * @param condition 条件
 * @param options オプション
 * @returns 文字列が条件に合うかを判定する関数
 */
export default function createStringMatcher(
  condition: StringCondition,
  options: CreateStringMatcherOptions = {},
): StringPredicate {
  const { ignoreCase = false } = options;
  const normalize: (value: string) => string = options.normalize ?? alwaysInput;
  const toComparable = ignoreCase
    ? (value: string) => normalize(value).toLowerCase()
    : normalize;

  // 完全一致の文字列はまとめて Set で比べる
  const exactValues = new Set<string>();
  const matchers: _Matcher[] = [];
  for (const item of _flatten(condition)) {
    if (typeof item === 'string') {
      exactValues.add(toComparable(item));
    } else {
      const matcher = _createMatcher(item, ignoreCase, toComparable);
      if (matcher) {
        matchers.push(matcher);
      }
    }
  }

  return (value) => {
    const normalized = normalize(value);
    const comparable = ignoreCase ? normalized.toLowerCase() : normalized;
    return (
      exactValues.has(comparable) ||
      matchers.some((matcher) => matcher(value, normalized, comparable))
    );
  };
}

/**
 * 条件を、配列の入れ子も含めて1列にする（入れ子の配列も OR として扱う）
 */
function _flatten(condition: StringCondition): StringConditionItem[] {
  if (!Array.isArray(condition)) {
    return [condition as StringConditionItem];
  }
  return (condition as readonly StringCondition[]).flatMap(_flatten);
}

function _createMatcher(
  item: Exclude<StringConditionItem, string>,
  ignoreCase: boolean,
  toComparable: (value: string) => string,
): _Matcher | undefined {
  if (typeof item === 'function') {
    // 関数には正規化する前の値を渡す
    return (value) => item(value);
  }
  if (isRegExp(item)) {
    const regExp = _toRegExp(item, ignoreCase);
    return regExp && ((_value, normalized) => _test(regExp, normalized));
  }
  if (typeof item === 'object' && item !== null) {
    return _createComparisonMatcher(item, ignoreCase, toComparable);
  }
  // 型にない値は何にも一致しない
  return undefined;
}

/**
 * StringComparison の判定の関数を作る。書いてある比べ方すべてに合うときに一致する
 */
function _createComparisonMatcher(
  comparison: StringComparison,
  ignoreCase: boolean,
  toComparable: (value: string) => string,
): _Matcher {
  const { includes, startsWith, endsWith, matches } = comparison;
  const checks: _Matcher[] = [];
  if (typeof includes === 'string') {
    const target = toComparable(includes);
    checks.push((_value, _normalized, comparable) =>
      comparable.includes(target),
    );
  }
  if (typeof startsWith === 'string') {
    const target = toComparable(startsWith);
    checks.push((_value, _normalized, comparable) =>
      comparable.startsWith(target),
    );
  }
  if (typeof endsWith === 'string') {
    const target = toComparable(endsWith);
    checks.push((_value, _normalized, comparable) =>
      comparable.endsWith(target),
    );
  }
  if (typeof matches === 'string' || isRegExp(matches)) {
    const regExp = _toRegExp(matches, ignoreCase);
    // 正規表現として不正な場合は、この比べ方を含むオブジェクト全体が一致しない
    checks.push(
      regExp ? (_value, normalized) => _test(regExp, normalized) : () => false,
    );
  }
  if (checks.length === 0) {
    // 比べ方が1つも無い（{} や書き間違い）場合は、何にも一致しない
    return () => false;
  }
  return (value, normalized, comparable) =>
    checks.every((check) => check(value, normalized, comparable));
}

/**
 * 条件の正規表現を作る。ignoreCase なら i フラグを付ける。文字列が正規表現として不正な場合は undefined
 */
function _toRegExp(
  pattern: string | RegExp,
  ignoreCase: boolean,
): RegExp | undefined {
  if (isRegExp(pattern)) {
    return ignoreCase && !pattern.flags.includes('i')
      ? new RegExp(pattern.source, `${pattern.flags}i`)
      : pattern;
  }
  try {
    return new RegExp(pattern, ignoreCase ? 'i' : '');
  } catch {
    return undefined;
  }
}

/**
 * search は lastIndex を使わないため、g フラグ付きの正規表現でも結果が変わらない
 */
function _test(regExp: RegExp, value: string): boolean {
  return value.search(regExp) !== -1;
}
