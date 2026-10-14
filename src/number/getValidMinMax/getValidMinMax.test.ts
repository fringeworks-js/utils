import getValidMinMax from './getValidMinMax';

describe('getValidMinMax', () => {
  it('正しい順序の場合はそのまま返す', () => {
    expect(getValidMinMax(0, 10)).toEqual([0, 10]);
  });

  it('逆順の場合は正しい順序に直す', () => {
    expect(getValidMinMax(10, 0)).toEqual([0, 10]);
  });

  it('minがnullの場合は-Infinityをデフォルトとして使う', () => {
    expect(getValidMinMax(null, 10)).toEqual([-Infinity, 10]);
  });

  it('maxがnullの場合はInfinityをデフォルトとして使う', () => {
    expect(getValidMinMax(0, null)).toEqual([0, Infinity]);
  });

  it('両方nullの場合', () => {
    expect(getValidMinMax(null, null)).toEqual([-Infinity, Infinity]);
  });

  it('defaultMinを指定した場合', () => {
    expect(getValidMinMax(null, 10, { defaultMin: 0 })).toEqual([0, 10]);
  });

  it('defaultMaxを指定した場合', () => {
    expect(getValidMinMax(0, null, { defaultMax: 100 })).toEqual([0, 100]);
  });

  it('同じ値の場合', () => {
    expect(getValidMinMax(5, 5)).toEqual([5, 5]);
  });

  it('NaNの場合はデフォルトを使う', () => {
    expect(getValidMinMax(NaN, 5)).toEqual([-Infinity, 5]);
    expect(getValidMinMax(0, NaN)).toEqual([0, Infinity]);
    expect(getValidMinMax(NaN, NaN, { defaultMin: 1, defaultMax: 2 })).toEqual([
      1, 2,
    ]);
  });
});
