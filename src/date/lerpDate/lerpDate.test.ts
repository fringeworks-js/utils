import lerpDate from './lerpDate';

describe('lerpDate', () => {
  it('ratio=1のとき目標値を返す', () => {
    const base = new Date('2024-01-01');
    const value = new Date('2024-12-31');
    const result = lerpDate(value, 1, { baseValue: base });
    expect(result.getTime()).toBe(value.getTime());
  });

  it('ratio=0のとき基準値を返す', () => {
    const base = new Date('2024-01-01');
    const value = new Date('2024-12-31');
    const result = lerpDate(value, 0, { baseValue: base });
    expect(result.getTime()).toBe(base.getTime());
  });

  it('ratio=0.5のとき中間値を返す', () => {
    const base = new Date('2024-01-01T00:00:00.000Z');
    const value = new Date('2024-01-01T00:00:02.000Z');
    const result = lerpDate(value, 0.5, { baseValue: base });
    expect(result.getTime()).toBe(
      new Date('2024-01-01T00:00:01.000Z').getTime(),
    );
  });

  it('baseValueを省略すると現在時刻を使う', () => {
    const before = Date.now();
    const value = new Date(before + 2000);
    const result = lerpDate(value, 0.5);
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before + 1000 - 10);
    expect(result.getTime()).toBeLessThanOrEqual(after + 1000 + 10);
  });

  it('基準値より前の日時にはratio=0.5で中間を返す', () => {
    const base = new Date('2024-06-01T00:00:00.000Z');
    const value = new Date('2024-01-01T00:00:00.000Z');
    const result = lerpDate(value, 0.5, { baseValue: base });
    const expected = new Date((base.getTime() + value.getTime()) / 2);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('ratioが範囲外の場合は外挿する', () => {
    const base = new Date('2024-01-01T00:00:00.000Z');
    const value = new Date('2024-01-01T00:00:02.000Z');
    expect(lerpDate(value, 2, { baseValue: base }).toISOString()).toBe(
      '2024-01-01T00:00:04.000Z',
    );
    expect(lerpDate(value, -1, { baseValue: base }).toISOString()).toBe(
      '2023-12-31T23:59:58.000Z',
    );
  });

  it('Invalid Dateを渡すとInvalid Dateを返す', () => {
    expect(lerpDate(new Date(NaN), 0.5).getTime()).toBeNaN();
  });
});
