import type { GetRawTypeResult } from './types';

/**
 * オブジェクトの内部的な型ラベルを取得する
 */
export default function getRawType(value: unknown): GetRawTypeResult {
  return Object.prototype.toString.call(value) as GetRawTypeResult;
}
