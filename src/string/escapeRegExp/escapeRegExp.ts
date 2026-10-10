const SEARCH_REGEXP = /[-.*+?^${}()|[\]\\]/g;

/**
 * 正規表現のリテラル部分を文字列で記述する際に必要なエスケープ。\
 * RegExpのコンストラクターに渡せる形式
 *
 * `-` は `\-` だと `u` / `v` フラグで構文エラーになるため、`\x2d` にする
 * （標準の `RegExp.escape` と同じ）。文字クラスの中に入れても範囲指定にならない
 */
export default function escapeRegExp(target: string) {
  return target.replace(SEARCH_REGEXP, (char) =>
    char === '-' ? '\\x2d' : `\\${char}`,
  );
}
