import clearArrayMutable from './clearArrayMutable';

describe('clearArrayMutable', () => {
  it('全要素削除', () => {
    const array = [0, 1, 2, 3, 4];
    const result = clearArrayMutable(array);
    expect(array).toEqual([]);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });
});
