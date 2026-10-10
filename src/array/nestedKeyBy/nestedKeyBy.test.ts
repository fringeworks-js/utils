import nestedKeyBy from './nestedKeyBy';

describe('nestedKeyBy', () => {
  const ITEM0 = { $id: 'ID0', field0: 0, field1: 4, field2: 0, field3: '!!' };
  const ITEM1 = { $id: 'ID1', field0: 1, field1: 3, field2: 1, field3: '!!' };
  const ITEM2 = { $id: 'ID2', field0: 2, field1: 2, field2: 0, field3: '!' };
  const ITEM3 = { $id: 'ID3', field0: 3, field1: 1, field2: 1, field3: '!' };
  const ITEM4 = { $id: 'ID4', field0: 4, field1: 0, field2: 0, field3: '!' };

  it('1項目', () => {
    const array = [ITEM0, ITEM1, ITEM2, ITEM3, ITEM4];
    const result = nestedKeyBy(array, '$id');
    expect(result).toEqual({
      ID0: ITEM0,
      ID1: ITEM1,
      ID2: ITEM2,
      ID3: ITEM3,
      ID4: ITEM4,
    });
  });

  it('複数項目', () => {
    const array = [ITEM0, ITEM1, ITEM2, ITEM3, ITEM4];
    const result = nestedKeyBy(array, ['field3', '$id']);
    expect(result).toEqual({
      '!!': {
        ID0: ITEM0,
        ID1: ITEM1,
      },
      '!': {
        ID2: ITEM2,
        ID3: ITEM3,
        ID4: ITEM4,
      },
    });
  });

  it('複数項目(flat)', () => {
    const array = [ITEM0, ITEM1, ITEM2, ITEM3, ITEM4];
    const result = nestedKeyBy(array, ['field3', '$id'], { flat: true });
    expect(result).toEqual({
      '!!.ID0': ITEM0,
      '!!.ID1': ITEM1,
      '!.ID2': ITEM2,
      '!.ID3': ITEM3,
      '!.ID4': ITEM4,
    });
  });

  it('複数項目(flat & 区切り文字="/")', () => {
    const array = [ITEM0, ITEM1, ITEM2, ITEM3, ITEM4];
    const result = nestedKeyBy(array, ['field3', '$id'], {
      flat: true,
      keySeparator: '/',
    });
    expect(result).toEqual({
      '!!/ID0': ITEM0,
      '!!/ID1': ITEM1,
      '!/ID2': ITEM2,
      '!/ID3': ITEM3,
      '!/ID4': ITEM4,
    });
  });

  describe('overwrite', () => {
    it('overwrite: true で後の値が優先される', () => {
      const ITEM_A = { $id: 'ID0', value: 'A' };
      const ITEM_B = { $id: 'ID0', value: 'B' };
      const result = nestedKeyBy([ITEM_A, ITEM_B], '$id', { overwrite: true });
      expect(result).toEqual({ ID0: ITEM_B });
    });

    it('overwrite: false (デフォルト) で先の値が優先される', () => {
      const ITEM_A = { $id: 'ID0', value: 'A' };
      const ITEM_B = { $id: 'ID0', value: 'B' };
      const result = nestedKeyBy([ITEM_A, ITEM_B], '$id');
      expect(result).toEqual({ ID0: ITEM_A });
    });

    it('overwrite: true で複数項目のとき後の値が優先される', () => {
      const ITEM_A = { field3: '!!', $id: 'ID0', value: 'A' };
      const ITEM_B = { field3: '!!', $id: 'ID0', value: 'B' };
      const result = nestedKeyBy([ITEM_A, ITEM_B], ['field3', '$id'], {
        overwrite: true,
      });
      expect(result).toEqual({ '!!': { ID0: ITEM_B } });
    });
  });

  it('nullを渡した場合は空オブジェクトを返す', () => {
    const result = nestedKeyBy(null as any, '$id');
    expect(result).toEqual({});
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const array = [ITEM0, ITEM1, ITEM2, ITEM3, ITEM4];
      const result = nestedKeyBy.dataLast('$id')(array);
      expect(result).toEqual({
        ID0: ITEM0,
        ID1: ITEM1,
        ID2: ITEM2,
        ID3: ITEM3,
        ID4: ITEM4,
      });
    });
  });
});
