import createUtcDate from './createUtcDate';

describe('createUtcDate', () => {
  it('UTC日付を作成する', () => {
    const date = createUtcDate(2024, 0, 1); // 2024年1月1日
    expect(date.getUTCFullYear()).toBe(2024);
    expect(date.getUTCMonth()).toBe(0);
    expect(date.getUTCDate()).toBe(1);
  });

  it('時刻を指定してUTC日付を作成する', () => {
    const date = createUtcDate(2024, 5, 15, 10, 30, 45, 500);
    expect(date.getUTCFullYear()).toBe(2024);
    expect(date.getUTCMonth()).toBe(5);
    expect(date.getUTCDate()).toBe(15);
    expect(date.getUTCHours()).toBe(10);
    expect(date.getUTCMinutes()).toBe(30);
    expect(date.getUTCSeconds()).toBe(45);
    expect(date.getUTCMilliseconds()).toBe(500);
  });

  it('0〜99年をそのままの年として扱う', () => {
    expect(createUtcDate(50).toISOString()).toBe('0050-01-01T00:00:00.000Z');
    expect(createUtcDate(0, 5, 15, 10).toISOString()).toBe(
      '0000-06-15T10:00:00.000Z',
    );
  });

  it('範囲外の値は繰り上げ・繰り下げる', () => {
    expect(createUtcDate(2024, 12, 1).toISOString()).toBe(
      '2025-01-01T00:00:00.000Z',
    );
    expect(createUtcDate(2024, 0, 31, 24).toISOString()).toBe(
      '2024-02-01T00:00:00.000Z',
    );
    expect(createUtcDate(99, 11, 31, 24).toISOString()).toBe(
      '0100-01-01T00:00:00.000Z',
    );
  });

  it('Dateインスタンスを返す', () => {
    expect(createUtcDate(2024, 0, 1)).toBeInstanceOf(Date);
  });
});
