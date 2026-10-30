import createRange from './createRange';

describe('createRange', () => {
  it('0から始まる連番を作る', () => {
    expect(createRange(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('0は空配列', () => {
    expect(createRange(0)).toEqual([]);
  });

  it('start: 最初の値を指定する', () => {
    expect(createRange(3, { start: 1 })).toEqual([1, 2, 3]);
  });

  it('step: 値の差を指定する', () => {
    expect(createRange(4, { step: 5 })).toEqual([0, 5, 10, 15]);
  });

  it('step: 負の数で値が減っていく', () => {
    expect(createRange(3, { start: 10, step: -1 })).toEqual([10, 9, 8]);
  });

  it('step: 小数でも誤差がたまらない', () => {
    const result = createRange(11, { step: 0.1 });
    expect(result[10]).toBe(10 * 0.1);
    expect(result[3]).toBe(3 * 0.1);
  });

  it('undefinedのオプションは指定しなかったものとして扱う', () => {
    expect(createRange(3, { start: undefined, step: undefined })).toEqual([
      0, 1, 2,
    ]);
  });

  it('lengthの小数は切り捨てる', () => {
    expect(createRange(2.9)).toEqual([0, 1]);
  });

  it('lengthの負の数・NaN・Infinityは空配列', () => {
    expect(createRange(-1)).toEqual([]);
    expect(createRange(NaN)).toEqual([]);
    expect(createRange(Infinity)).toEqual([]);
    expect(createRange(-Infinity)).toEqual([]);
  });

  it('毎回新しい配列を返す', () => {
    expect(createRange(3)).not.toBe(createRange(3));
  });
});
