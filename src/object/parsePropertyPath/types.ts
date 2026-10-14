/**
 * プロパティのパス
 * - 文字列 — `'a.b[0]'` 形式のパスとして解釈する（parsePropertyPath を参照）
 * - 数値・symbol — 1つのキーとして扱う
 * - 配列 — キーを順に並べたものとして扱う
 */
export type PropertyPath = PropertyKey | readonly PropertyKey[];
