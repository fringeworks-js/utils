import { describe, expect, it } from 'vitest';
import pushUnique from './pushUnique';

describe('pushUnique', () => {
  describe('基本動作', () => {
    it('重複しない要素を追加した新しい配列を返す', () => {
      const result = pushUnique([1, 2, 3], [4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('重複する要素は追加しない', () => {
      const result = pushUnique([1, 2, 3], [2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('重複あり・なしが混在する場合、重複しない要素のみ追加する', () => {
      const result = pushUnique([1, 2, 3], [2, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('dataを破壊的に変更しない', () => {
      const data = [1, 2, 3];
      pushUnique(data, [4]);
      expect(data).toEqual([1, 2, 3]);
    });

    it('戻り値はdataと異なる参照である', () => {
      const data = [1, 2, 3];
      const result = pushUnique(data, [4]);
      expect(result).not.toBe(data);
    });

    it('itemsに重複がある場合、最初の1つのみ追加する', () => {
      const result = pushUnique([1], [2, 2]);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('null / undefined', () => {
    it('dataがnullの場合は空配列として扱う', () => {
      expect(pushUnique(null, [1, 1, 2])).toEqual([1, 2]);
    });

    it('dataがundefinedの場合は空配列として扱う', () => {
      expect(pushUnique(undefined, [1])).toEqual([1]);
    });

    it('itemsがnullの場合はdataのコピーを返す', () => {
      const data = [1, 2, 3];
      const result = pushUnique(data, null);
      expect(result).toEqual(data);
      expect(result).not.toBe(data);
    });

    it('itemsがundefinedの場合はdataのコピーを返す', () => {
      const data = [1, 2, 3];
      const result = pushUnique(data, undefined);
      expect(result).toEqual(data);
      expect(result).not.toBe(data);
    });

    it('dataもitemsもnullの場合は空配列を返す', () => {
      expect(pushUnique(null, null)).toEqual([]);
    });
  });

  describe('threshold オプション', () => {
    it('thresholdを下回る場合はincludesで判定する', () => {
      const result = pushUnique([1, 2, 3], [2, 4], { threshold: 100 });
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('thresholdを上回る場合はSetで判定する', () => {
      const data = Array.from({ length: 50 }, (_, i) => i);
      const result = pushUnique(data, [0, 50], { threshold: 10 });
      expect(result).toContain(50);
      expect(result?.filter((v) => v === 0)).toHaveLength(1);
    });
  });

  describe('isEqual オプション', () => {
    it('isEqualによる同一性判定で重複を除外する', () => {
      const result = pushUnique(
        [{ id: 1 }, { id: 2 }],
        [{ id: 2 }, { id: 3 }],
        {
          isEqual: (a, b) => a.id === b.id,
        },
      );
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('isEqual指定時もdataを破壊的に変更しない', () => {
      const data = [{ id: 1 }];
      pushUnique(data, [{ id: 2 }], { isEqual: (a, b) => a.id === b.id });
      expect(data).toEqual([{ id: 1 }]);
    });
  });

  it('readonly の配列を受け付ける', () => {
    const data: readonly number[] = [1, 2];
    const items: readonly number[] = [2, 3];
    const result = pushUnique(data, items);
    expect(result).toEqual([1, 2, 3]);
    expectTypeOf(result).toEqualTypeOf<number[]>();
  });
});
