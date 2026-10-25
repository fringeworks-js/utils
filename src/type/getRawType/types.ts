import type { ToStringResult } from '@fringeworks/types';

/**
 * `Object.prototype.toString` の結果の型。\
 * 主要な組み込みオブジェクトの型ラベルを補完できるようにしつつ、それ以外の型ラベルも受け付ける
 */
export type GetRawTypeResult =
  ToStringResult | (`[object ${string}]` & Record<never, never>);
