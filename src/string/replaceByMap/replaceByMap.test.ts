import replaceByMap from './replaceByMap';

describe('replaceByMap', () => {
  it('置換', () => {
    const result = replaceByMap(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      new Map([
        ['ABC', '!!!'],
        ['M', '?'],
        ['YZ', '@@'],
      ]),
    );
    expect(result).toBe('!!!DEFGHIJKL?NOPQRSTUVWX@@');
  });
  it('sourceの文字列が長い方が有効', () => {
    const result = replaceByMap(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      new Map([
        ['B', '_'],
        ['ABC', '!!!'],
        ['M', '?'],
        ['YZ', '@@'],
      ]),
    );
    expect(result).toBe('!!!DEFGHIJKL?NOPQRSTUVWX@@');
  });
  it('長さが変わる置換', () => {
    const result = replaceByMap(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      new Map([
        ['ABC', '!'],
        ['M', '???'],
        ['YZ', ''],
      ]),
    );
    expect(result).toBe('!DEFGHIJKL???NOPQRSTUVWX');
  });
  it('置換された文字列の置換はしない', () => {
    const result = replaceByMap(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      new Map([
        ['ABC', 'MYZ'],
        ['M', '?'],
        ['YZ', '@@'],
      ]),
    );
    expect(result).toBe('MYZDEFGHIJKL?NOPQRSTUVWX@@');
  });

  it('一致しない場合は元の文字列を返す', () => {
    expect(replaceByMap('abc', new Map([['x', 'X']]))).toBe('abc');
  });

  it('空のmapの場合は元の文字列を返す', () => {
    expect(replaceByMap('abc', new Map())).toBe('abc');
  });

  it('連続する一致と、一致の間の文字列を置換する', () => {
    expect(
      replaceByMap(
        'aabXbaa',
        new Map([
          ['a', '1'],
          ['b', '2'],
        ]),
      ),
    ).toBe('112X211');
  });

  it('先頭の文字が一致しても、続く文字が一致しなければ置換しない', () => {
    expect(replaceByMap('abacab', new Map([['ab', '!']]))).toBe('!ac!');
  });

  it('同じ文字から始まるキーは長いものを優先する', () => {
    expect(
      replaceByMap(
        'ｶﾞｶｶﾞ',
        new Map([
          ['ｶ', 'カ'],
          ['ｶﾞ', 'ガ'],
        ]),
      ),
    ).toBe('ガカガ');
  });

  it('正規表現の特殊文字をキーにできる', () => {
    expect(
      replaceByMap(
        'a-b]c^d\\e[f.g',
        new Map([
          ['-', '1'],
          [']', '2'],
          ['^', '3'],
          ['\\', '4'],
          ['[', '5'],
          ['.', '6'],
        ]),
      ),
    ).toBe('a1b2c3d4e5f6g');
  });

  it('サロゲートペアをキーにできる', () => {
    expect(
      replaceByMap(
        '😀😀😀🙂',
        new Map([
          ['😀', 'A'],
          ['😀😀', 'B'],
        ]),
      ),
    ).toBe('BA🙂');
  });

  it('同じmapを変更した場合は変更後のmapで置換する', () => {
    const map: Record<string, string> = { a: 'A' };
    expect(replaceByMap('abc', map)).toBe('Abc');
    map.b = 'B';
    expect(replaceByMap('abc', map)).toBe('ABc');
  });
});
