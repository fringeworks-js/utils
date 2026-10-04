import type { ToStringResult } from '@fringeworks/constants';

/**
 * 主要な組み込みオブジェクトの型ラベルのUnion
 */
export type GetRawTypeReturn = ToStringResult | `[object ${string}]`;
