import getPriority from './getPriority';

describe('getPriority', () => {
  it('undefinedは-2', () => {
    expect(getPriority(undefined)).toBe(-2);
  });

  it('nullは-1', () => {
    expect(getPriority(null)).toBe(-1);
  });

  it('その他の値は0', () => {
    expect(getPriority(42)).toBe(0);
    expect(getPriority('hello')).toBe(0);
    expect(getPriority({})).toBe(0);
  });

  describe('priorityMap', () => {
    it('カスタム優先度マップ', () => {
      expect(
        getPriority(undefined, { priorityMap: { undefined: 0, null: 1 } }),
      ).toBe(0);
      expect(
        getPriority(null, { priorityMap: { undefined: 0, null: 1 } }),
      ).toBe(1);
    });

    it('priorityMapに対応するキーがない場合は0を返す', () => {
      expect(getPriority(undefined, { priorityMap: { null: -1 } })).toBe(0);
      expect(getPriority(null, { priorityMap: { undefined: -2 } })).toBe(0);
    });
  });

  describe('kind オプション', () => {
    it('kind で型別優先度を指定', () => {
      expect(
        getPriority([], {
          useKind: true,
          priorityMap: { undefined: -2, null: -1, array: 5 },
        }),
      ).toBe(5);
    });
  });

  describe('getFallbackPriority', () => {
    it('フォールバック優先度', () => {
      expect(getPriority('hello', { getFallbackPriority: () => 10 })).toBe(10);
    });
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(getPriority.dataLast()(undefined)).toBe(-2);
    });
  });
});
