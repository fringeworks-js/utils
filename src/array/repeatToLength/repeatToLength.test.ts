import repeatToLength from './repeatToLength';

describe('repeatToLength', () => {
  it('空配列', () => {
    const array: number[] = [];
    const result = repeatToLength(array, 3);
    expect(result).toEqual([]);
  });

  it('0周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, 0);
    expect(result).toEqual([]);
  });

  it('0.5周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, 2);
    expect(result).toEqual([0, 1]);
  });

  it('1周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, 4);
    expect(result).toEqual([0, 1, 2, 3]);
  });

  it('1.5周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, 6);
    expect(result).toEqual([0, 1, 2, 3, 0, 1]);
  });

  it('2周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, 8);
    expect(result).toEqual([0, 1, 2, 3, 0, 1, 2, 3]);
  });

  it('-0.5周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, -2);
    expect(result).toEqual([3, 2]);
  });

  it('-1周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, -4);
    expect(result).toEqual([3, 2, 1, 0]);
  });

  it('-1.5周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, -6);
    expect(result).toEqual([3, 2, 1, 0, 3, 2]);
  });

  it('-2周', () => {
    const array = [0, 1, 2, 3];
    const result = repeatToLength(array, -8);
    expect(result).toEqual([3, 2, 1, 0, 3, 2, 1, 0]);
  });
  it('小数は切り捨てる', () => {
    expect(repeatToLength([1, 2], 2.5)).toEqual([1, 2]);
    expect(repeatToLength([1, 2], -2.5)).toEqual([2, 1]);
  });

  it('NaN・Infinityは0として扱う', () => {
    expect(repeatToLength([1, 2], NaN)).toEqual([]);
    expect(repeatToLength([1, 2], Infinity)).toEqual([]);
  });

  it('要素数が多い配列も繰り返せる', () => {
    const result = repeatToLength(new Array(300000).fill(0), 300001);
    expect(result.length).toBe(300001);
  });

  it('nullを渡した場合は空配列を返す', () => {
    expect(repeatToLength(null, 3)).toEqual([]);
    expect(repeatToLength(undefined, 3)).toEqual([]);
  });
});
