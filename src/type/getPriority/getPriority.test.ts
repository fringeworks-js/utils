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
    it('既定値を上書きできる', () => {
      const priorityMap = { undefined: 0, null: 1 };
      expect(getPriority(undefined, { priorityMap })).toBe(0);
      expect(getPriority(null, { priorityMap })).toBe(1);
    });

    it('既定値とマージする', () => {
      const priorityMap = { string: 1 };
      expect(getPriority('a', { priorityMap })).toBe(1);
      expect(getPriority(undefined, { priorityMap })).toBe(-2);
      expect(getPriority(null, { priorityMap })).toBe(-1);
    });

    it('getKindの型種別で指定できる', () => {
      const priorityMap = { array: 5, date: 4, plainobject: 3, instance: 2 };
      expect(getPriority([], { priorityMap })).toBe(5);
      expect(getPriority(new Date(), { priorityMap })).toBe(4);
      expect(getPriority({}, { priorityMap })).toBe(3);
      expect(getPriority(new (class {})(), { priorityMap })).toBe(2);
    });
  });

  describe('getFallbackPriority', () => {
    it('priorityMapに無い型種別の優先度を決める', () => {
      expect(getPriority('hello', { getFallbackPriority: () => 10 })).toBe(10);
    });

    it('priorityMapや既定値にある型種別には使わない', () => {
      const getFallbackPriority = () => 10;
      expect(getPriority(null, { getFallbackPriority })).toBe(-1);
      expect(
        getPriority('a', { priorityMap: { string: 1 }, getFallbackPriority }),
      ).toBe(1);
    });
  });
});
