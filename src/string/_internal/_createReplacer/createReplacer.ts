import type { Replacer } from '../../createReplacerByMap/types';

/**
 * 先頭のコード単位ごとの索引
 */
type IndexEntry = {
  /**
   * 1文字のキーの置換後の文字列
   */
  value?: string;

  /**
   * この文字から始まる複数文字のキーと置換後の文字列（長い順）
   */
  multis?: [string, string][];
};

/**
 * マップによる置き換えで文字列置換をする関数を作る
 *
 * キーの先頭の文字で引く索引を使い、先頭から順に置換する。
 * 一致しなかった位置では、キーの先頭の文字を集めた正規表現で次の候補まで読み飛ばす。
 * キーが重なる場合は長いキーを優先し、置換後の文字列は再び置換しない。
 * 索引は作成時に作るため、作成後に map を変更しても反映しない
 *
 * @param map 置換前の文字列をキー、置換後の文字列を値に持つマップ
 * @returns 文字列を置換する関数。空文字・null・undefined はそのまま返す
 */
export default function createReplacer(
  map: ReadonlyMap<string, string>,
): Replacer {
  const index = new Map<number, IndexEntry>();
  for (const [key, value] of map) {
    if (!key) {
      continue;
    }
    const code = key.charCodeAt(0);
    let entry = index.get(code);
    if (!entry) {
      entry = {};
      index.set(code, entry);
    }
    if (key.length === 1) {
      entry.value = value;
    } else {
      (entry.multis ??= []).push([key, value]);
    }
  }
  if (!index.size) {
    return (str) => str;
  }
  // 最長一致になるよう、長いキーから並べる
  for (const entry of index.values()) {
    entry.multis?.sort((a, b) => b[0].length - a[0].length);
  }

  // 次の候補（キーの先頭のコード単位）を探す正規表現
  // 索引と同じくコード単位で扱うため、u フラグは付けない
  const firstChars = Array.from(index.keys(), (code) =>
    String.fromCharCode(code).replace(/[\\\]^-]/g, '\\$&'),
  ).join('');
  const finder = new RegExp(`[${firstChars}]`, 'g');

  return (str) => {
    if (!str) {
      return str;
    }
    const length = str.length;
    let result = '';
    // 未連結の区間の先頭
    let last = 0;
    let i = 0;
    while (i < length) {
      const entry = index.get(str.charCodeAt(i));
      if (entry) {
        let matchedLength = 0;
        let value = '';
        if (entry.multis) {
          for (const [key, multiValue] of entry.multis) {
            if (str.startsWith(key, i)) {
              matchedLength = key.length;
              value = multiValue;
              break;
            }
          }
        }
        if (!matchedLength && entry.value !== undefined) {
          matchedLength = 1;
          value = entry.value;
        }
        if (matchedLength) {
          // 一致しなかった区間はまとめて連結する
          result += str.slice(last, i) + value;
          i += matchedLength;
          last = i;
          continue;
        }
      }
      // 一致しなかったので、次の候補まで読み飛ばす
      finder.lastIndex = i + 1;
      if (!finder.test(str)) {
        break;
      }
      i = finder.lastIndex - 1;
    }
    // 一度も置換しなかった場合は元の文字列をそのまま返す
    return last === 0 ? str : result + str.slice(last);
  };
}
