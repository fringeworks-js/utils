import asUtcDate from './asUtcDate';

describe('asUtcDate', () => {
  it('ローカル日時と同じUTC日時を持つDateを返す', () => {
    const local = new Date(2024, 0, 15, 10, 30, 45, 500);
    const utc = asUtcDate(local);

    expect(utc.getUTCFullYear()).toBe(local.getFullYear());
    expect(utc.getUTCMonth()).toBe(local.getMonth());
    expect(utc.getUTCDate()).toBe(local.getDate());
    expect(utc.getUTCHours()).toBe(local.getHours());
    expect(utc.getUTCMinutes()).toBe(local.getMinutes());
    expect(utc.getUTCSeconds()).toBe(local.getSeconds());
    expect(utc.getUTCMilliseconds()).toBe(local.getMilliseconds());
  });

  it('0〜99年の日時もそのままの年で扱う', () => {
    const local = new Date(2000, 5, 15, 10, 30);
    local.setFullYear(50);
    expect(asUtcDate(local).toISOString()).toBe('0050-06-15T10:30:00.000Z');
  });

  it('Dateインスタンスを返す', () => {
    expect(asUtcDate(new Date())).toBeInstanceOf(Date);
  });
});
