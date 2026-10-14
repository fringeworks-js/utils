import * as R from 'remeda';
import type { PropertyPath } from './types';

/**
 * プロパティのパスをキーの配列に変換する
 *
 * 文字列は次の規則で解釈する
 * - `.` で区切った部分は文字列のキー（`'a.1'` は `['a', '1']`）
 * - `[1]` のように角括弧で囲んだ0以上の整数は、配列のインデックス（`'a[1]'` は `['a', 1]`）
 * - `["b.c"]` や `['b.c']` のように引用符で囲むと、`.` や `[` を含むキーも書ける。`\` で次の文字をそのまま使う
 * - 引用符の無い角括弧の中身が整数でない場合（`[b]`・`[01]`・`[-1]`）は、文字列のキー
 * - 空のキー（`'a..b'` の間など）は読み飛ばす
 * - 閉じていない角括弧や引用符は、そこから後ろをキーの文字として扱う
 *
 * 数値・symbolは1つのキーとして扱い、配列はそのまま返す
 * @param path プロパティのパス
 * @returns キーの配列
 * @example
 * parsePropertyPath('a.b[0].c'); // ['a', 'b', 0, 'c']
 * parsePropertyPath('a.1'); // ['a', '1']
 * parsePropertyPath('a["b.c"]'); // ['a', 'b.c']
 */
export default function parsePropertyPath(
  path: PropertyPath,
): readonly PropertyKey[] {
  if (R.isArray(path)) {
    return path;
  }
  if (typeof path !== 'string') {
    return [path];
  }

  const keys: PropertyKey[] = [];
  // 読み取り中のキー
  let key = '';
  const flush = () => {
    if (key !== '') {
      keys.push(key);
      key = '';
    }
  };

  let i = 0;
  while (i < path.length) {
    const char = path[i]!;
    if (char === '.') {
      flush();
      i++;
    } else if (char === '[') {
      const bracket = readBracket(path, i);
      if (bracket === undefined) {
        // 閉じていない場合は、残りをキーの文字として扱う
        key += path.slice(i);
        break;
      }
      flush();
      keys.push(bracket.key);
      i = bracket.next;
    } else {
      key += char;
      i++;
    }
  }
  flush();
  return keys;
}

/**
 * start の位置の `[` から始まる角括弧を読み取る
 * @returns 角括弧の中のキーと、角括弧の次の位置。閉じていない場合は undefined
 */
function readBracket(
  path: string,
  start: number,
): { key: PropertyKey; next: number } | undefined {
  const quote = path[start + 1];
  if (quote === '"' || quote === "'") {
    let value = '';
    let i = start + 2;
    while (i < path.length) {
      const char = path[i]!;
      if (char === '\\' && i + 1 < path.length) {
        value += path[i + 1];
        i += 2;
      } else if (char === quote) {
        return path[i + 1] === ']' ? { key: value, next: i + 2 } : undefined;
      } else {
        value += char;
        i++;
      }
    }
    return undefined;
  }

  const end = path.indexOf(']', start + 1);
  if (end === -1) {
    return undefined;
  }
  const content = path.slice(start + 1, end);
  return { key: toIndex(content), next: end + 1 };
}

/**
 * 0以上の整数の正規の表記であれば数値にする（`'01'` や `'-1'` は文字列のまま）
 */
function toIndex(content: string): PropertyKey {
  return /^(?:0|[1-9]\d*)$/.test(content) &&
    Number.isSafeInteger(Number(content))
    ? Number(content)
    : content;
}
