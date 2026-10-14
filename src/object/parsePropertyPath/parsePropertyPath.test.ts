import parsePropertyPath from './parsePropertyPath';

describe('parsePropertyPath', () => {
  it('ドットで区切ったキーと角括弧のインデックスを解釈する', () => {
    expect(parsePropertyPath('a.b[0].c')).toEqual(['a', 'b', 0, 'c']);
    expect(parsePropertyPath('a[1].b[2][3]')).toEqual(['a', 1, 'b', 2, 3]);
    expect(parsePropertyPath('[0].a')).toEqual([0, 'a']);
  });

  it('ドットの後の数字は文字列のキーにする', () => {
    expect(parsePropertyPath('a.1')).toEqual(['a', '1']);
    expect(parsePropertyPath('0.a')).toEqual(['0', 'a']);
  });

  it('角括弧の中が0以上の整数の正規の表記でなければ文字列のキーにする', () => {
    expect(parsePropertyPath('a[01]')).toEqual(['a', '01']);
    expect(parsePropertyPath('a[-1]')).toEqual(['a', '-1']);
    expect(parsePropertyPath('a[1.5]')).toEqual(['a', '1.5']);
    expect(parsePropertyPath('a[b]')).toEqual(['a', 'b']);
    expect(parsePropertyPath('a[]')).toEqual(['a', '']);
    expect(parsePropertyPath('a[9007199254740993]')).toEqual([
      'a',
      '9007199254740993',
    ]);
  });

  it('引用符で囲んだキーは記号を含めてそのまま使う', () => {
    expect(parsePropertyPath('a["b.c"]')).toEqual(['a', 'b.c']);
    expect(parsePropertyPath("a['[0]']")).toEqual(['a', '[0]']);
    expect(parsePropertyPath('a["1"]')).toEqual(['a', '1']);
    expect(parsePropertyPath('a["x\\"y"]')).toEqual(['a', 'x"y']);
    expect(parsePropertyPath('a["\\\\"]')).toEqual(['a', '\\']);
  });

  it('空のキーは読み飛ばす', () => {
    expect(parsePropertyPath('')).toEqual([]);
    expect(parsePropertyPath('a..b')).toEqual(['a', 'b']);
    expect(parsePropertyPath('.a.')).toEqual(['a']);
    expect(parsePropertyPath('a.[0]')).toEqual(['a', 0]);
  });

  it('閉じていない角括弧や引用符は、そこから後ろをキーの文字として扱う', () => {
    expect(parsePropertyPath('a[0')).toEqual(['a[0']);
    expect(parsePropertyPath('a.b["c')).toEqual(['a', 'b["c']);
    expect(parsePropertyPath('a["c"d]')).toEqual(['a["c"d]']);
  });

  it('数値・symbolは1つのキーとして扱う', () => {
    const symbol = Symbol('s');
    expect(parsePropertyPath(1)).toEqual([1]);
    expect(parsePropertyPath(symbol)).toEqual([symbol]);
  });

  it('配列はそのまま返す', () => {
    const path = ['a.b', 0] as const;
    expect(parsePropertyPath(path)).toBe(path);
  });
});
