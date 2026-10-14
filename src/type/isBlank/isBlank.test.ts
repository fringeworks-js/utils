import isBlank from './isBlank';

describe('isBlank', () => {
  it.each([undefined, null, ''])('%o はtrue', (value) => {
    expect(isBlank(value)).toBe(true);
  });

  it.each([
    ['半角スペース', '   '],
    ['全角スペース', '\u3000\u3000'],
    ['タブ・改行', '\t\n\r\v\f'],
    ['NBSP', '\u00a0'],
    ['空白の組み合わせ', ' \t\u3000\n'],
  ])('空白だけの文字列はtrue（%s）', (_, value) => {
    expect(isBlank(value)).toBe(true);
  });

  it.each(['a', ' a ', '\u3000a'])(
    '空白以外の文字を含む文字列はfalse（%o）',
    (value) => {
      expect(isBlank(value)).toBe(false);
    },
  );

  it.each([0, false, NaN, [], {}])('文字列以外の値はfalse（%o）', (value) => {
    expect(isBlank(value)).toBe(false);
  });
});
