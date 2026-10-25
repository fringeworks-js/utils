import { describe, expect, it } from 'vitest';
import pushUniqueMutable from './pushUniqueMutable';

describe('pushUniqueMutable', () => {
  describe('基本動作', () => {
    it('重複しない要素を追加する', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, [4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('重複する要素は追加しない', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, [2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('重複あり・なしが混在する場合、重複しない要素のみ追加する', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, [2, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('dataを破壊的に変更する', () => {
      const data = [1, 2, 3];
      pushUniqueMutable(data, [4]);
      expect(data).toEqual([1, 2, 3, 4]);
    });

    it('戻り値はdataと同じ参照である', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, [4]);
      expect(result).toBe(data);
    });

    it('itemsに重複がある場合、最初の1つのみ追加する', () => {
      const data = [1];
      const result = pushUniqueMutable(data, [2, 2]);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('null / undefined', () => {
    it('itemsがnullの場合はdataをそのまま返す', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, null);
      expect(result).toBe(data);
    });

    it('itemsがundefinedの場合はdataをそのまま返す', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, undefined);
      expect(result).toBe(data);
    });
  });

  describe('threshold オプション', () => {
    it('thresholdを下回る場合はincludesで判定する', () => {
      const data = [1, 2, 3];
      const result = pushUniqueMutable(data, [2, 4], { threshold: 100 });
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('thresholdを上回る場合はSetで判定する', () => {
      const data = Array.from({ length: 50 }, (_, i) => i);
      const result = pushUniqueMutable(data, [0, 50], { threshold: 10 });
      expect(result).toContain(50);
      expect(result?.filter((v) => v === 0)).toHaveLength(1);
    });
  });

  describe('isEqual オプション', () => {
    it('isEqualによる同一性判定で重複を除外する', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = pushUniqueMutable(data, [{ id: 2 }, { id: 3 }], {
        isEqual: (a, b) => a.id === b.id,
      });
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('isEqual指定時はthresholdに関わらず線形探索する', () => {
      const data = Array.from({ length: 200 }, (_, i) => ({ id: i }));
      const result = pushUniqueMutable(data, [{ id: 0 }, { id: 200 }], {
        isEqual: (a, b) => a.id === b.id,
        threshold: 10,
      });
      expect(result?.filter((v) => v.id === 0)).toHaveLength(1);
      expect(result?.some((v) => v.id === 200)).toBe(true);
    });
  });

  it('追加する要素は readonly の配列を受け付ける', () => {
    const items: readonly number[] = [2, 3];
    expect(pushUniqueMutable([1, 2], items)).toEqual([1, 2, 3]);
  });
});
