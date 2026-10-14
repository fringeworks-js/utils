import nestedGroupBy from './nestedGroupBy';

describe('nestedGroupBy', () => {
  const ITEM0 = { $id: 'ID0', field0: 0, field1: 4, field2: 0, field3: '!!' };
  const ITEM1 = { $id: 'ID1', field0: 1, field1: 3, field2: 1, field3: '!!' };
  const ITEM2A = { $id: 'ID2', field0: 21, field1: 21, field2: 0, field3: '!' };
  const ITEM2B = { $id: 'ID2', field0: 22, field1: 22, field2: 0, field3: '!' };
  const ITEM3 = { $id: 'ID3', field0: 3, field1: 1, field2: 1, field3: '!' };
  const ITEM4 = { $id: 'ID4', field0: 4, field1: 0, field2: 0, field3: '!' };

  it('1項目', () => {
    const array = [ITEM0, ITEM1, ITEM2A, ITEM2B, ITEM3, ITEM4];
    const result = nestedGroupBy(array, '$id');
    expect(result).toEqual({
      ID0: [ITEM0],
      ID1: [ITEM1],
      ID2: [ITEM2A, ITEM2B],
      ID3: [ITEM3],
      ID4: [ITEM4],
    });
  });

  it('複数項目', () => {
    const array = [ITEM0, ITEM1, ITEM2A, ITEM2B, ITEM3, ITEM4];
    const result = nestedGroupBy(array, ['field3', '$id']);
    expect(result).toEqual({
      '!!': {
        ID0: [ITEM0],
        ID1: [ITEM1],
      },
      '!': {
        ID2: [ITEM2A, ITEM2B],
        ID3: [ITEM3],
        ID4: [ITEM4],
      },
    });
  });

  it('複数項目(flat)', () => {
    const array = [ITEM0, ITEM1, ITEM2A, ITEM2B, ITEM3, ITEM4];
    const result = nestedGroupBy(array, ['field3', '$id'], { flat: true });
    expect(result).toEqual({
      '!!.ID0': [ITEM0],
      '!!.ID1': [ITEM1],
      '!.ID2': [ITEM2A, ITEM2B],
      '!.ID3': [ITEM3],
      '!.ID4': [ITEM4],
    });
  });

  it('複数項目(flat & 区切り文字="/")', () => {
    const array = [ITEM0, ITEM1, ITEM2A, ITEM2B, ITEM3, ITEM4];
    const result = nestedGroupBy(array, ['field3', '$id'], {
      flat: true,
      keySeparator: '/',
    });
    expect(result).toEqual({
      '!!/ID0': [ITEM0],
      '!!/ID1': [ITEM1],
      '!/ID2': [ITEM2A, ITEM2B],
      '!/ID3': [ITEM3],
      '!/ID4': [ITEM4],
    });
  });
  describe('Object.prototypeのプロパティ名のキー', () => {
    it('constructorもキーとしてグループ化する', () => {
      const result = nestedGroupBy([{ k: 'constructor' }], 'k');
      expect(Object.keys(result)).toEqual(['constructor']);
      expect(result['constructor']).toEqual([{ k: 'constructor' }]);
    });

    it('ネストしたキーとflatのキーでもグループ化する', () => {
      const data = [
        { a: '__proto__', k: 'toString' },
        { a: '__proto__', k: 'toString' },
      ];
      const nested = nestedGroupBy(data, ['a', 'k']);
      expect(Object.keys(nested)).toEqual(['__proto__']);
      expect(Object.getPrototypeOf(nested)).toBe(Object.prototype);
      expect(
        Object.getOwnPropertyDescriptor(nested, '__proto__')?.value,
      ).toEqual({
        toString: data,
      });
      expect(nestedGroupBy(data, ['a', 'k'], { flat: true })).toEqual({
        '__proto__.toString': data,
      });
    });
  });

  it('nullを渡した場合は空オブジェクトを返す', () => {
    expect(nestedGroupBy<{ id: string }>(null, 'id')).toEqual({});
  });
});
