import replacePlaceholders from './replacePlaceholders';

describe('replacePlaceholders', () => {
  it('置換(オブジェクト)', () => {
    const result = replacePlaceholders(
      '{{ABC}}DEFGHIJKL{{M}}NOPQRSTUVWX{{YZ}}',
      { ABC: '!!!', M: '?', YZ: '@@' },
    );
    expect(result).toBe('!!!DEFGHIJKL?NOPQRSTUVWX@@');
  });
  it('置換(配列)', () => {
    const result = replacePlaceholders('{{0}}DEFGHIJKL{{1}}NOPQRSTUVWX{{2}}', [
      '!!!',
      '?',
      '@@',
    ]);
    expect(result).toBe('!!!DEFGHIJKL?NOPQRSTUVWX@@');
  });
  it('置換対象がない場合(デフォルト)', () => {
    const result = replacePlaceholders(
      '{{ABC}}DEFGHIJKL{{M}}NOPQRSTUVWX{{YZ}}',
      { B: '_', M: '?', YZ: '@@' },
    );
    expect(result).toBe('{{ABC}}DEFGHIJKL?NOPQRSTUVWX@@');
  });
  it('置換対象がない場合(プレイスホルダーは削除)', () => {
    const result = replacePlaceholders(
      '{{ABC}}DEFGHIJKL{{M}}NOPQRSTUVWX{{YZ}}',
      { B: '_', M: '?', YZ: '@@' },
      { removeUnresolved: true },
    );
    expect(result).toBe('DEFGHIJKL?NOPQRSTUVWX@@');
  });
  it('任意の括り文字', () => {
    const result = replacePlaceholders(
      '{{ABC}}DEFGHIJKL*[M]*NOPQRSTUVWX*[YZ]*',
      { ABC: '!!!', M: '?', YZ: '@@' },
      { delimiters: ['*[', ']*'] },
    );
    expect(result).toBe('{{ABC}}DEFGHIJKL?NOPQRSTUVWX@@');
  });

  it('flatKeys: trueでネストしないキーで取得する', () => {
    const result = replacePlaceholders(
      '{{name}}さん',
      { name: 'Alice' },
      { flatKeys: true },
    );
    expect(result).toBe('Aliceさん');
  });
  it('delimitersに単一の文字列を指定すると開始・終了共通になる', () => {
    expect(
      replacePlaceholders('%name%さん', { name: 'Alice' }, { delimiters: '%' }),
    ).toBe('Aliceさん');
  });

  it('delimitersが空文字の場合は既定の囲み文字にする', () => {
    expect(
      replacePlaceholders('{{name}}%name%', { name: 'A' }, { delimiters: '' }),
    ).toBe('A%name%');
  });

  it('プレースホルダーの内側の前後の空白は無視する', () => {
    expect(replacePlaceholders('{{ a.b }}', { a: { b: 'x' } })).toBe('x');
  });

  it('改行を含むものはプレースホルダーとして扱わない', () => {
    expect(replacePlaceholders('{{a\n}}', { a: 'x' })).toBe('{{a\n}}');
  });

  it('キーが空のプレースホルダーは置換しない', () => {
    expect(replacePlaceholders('{{}}{{ }}', { a: 'x' })).toBe('{{}}{{ }}');
    expect(
      replacePlaceholders('{{}}', { a: 'x' }, { removeUnresolved: true }),
    ).toBe('');
  });

  it('数値・真偽値・配列は文字列にする', () => {
    expect(
      replacePlaceholders('{{n}} {{b}} {{arr}}', {
        n: 0,
        b: false,
        arr: [1, 2],
      }),
    ).toBe('0 false 1,2');
  });

  it('関数は値が見つからない場合と同じく扱う', () => {
    expect(replacePlaceholders('{{f}}', { f: () => 'x' })).toBe('{{f}}');
  });

  describe('プロトタイプ上のプロパティ', () => {
    class User {
      readonly name: string;
      constructor(name: string) {
        this.name = name;
      }
      get greeting() {
        return `Hello, ${this.name}`;
      }
    }

    it('既定では値として使わない', () => {
      expect(replacePlaceholders('{{toString}}', {})).toBe('{{toString}}');
      expect(
        replacePlaceholders('{{constructor}}', {}, { flatKeys: true }),
      ).toBe('{{constructor}}');
      expect(replacePlaceholders('{{__proto__}}', {})).toBe('{{__proto__}}');
      expect(replacePlaceholders('{{greeting}}', new User('A'))).toBe(
        '{{greeting}}',
      );
    });

    it('includeInherited: trueで値として使う', () => {
      expect(
        replacePlaceholders('{{greeting}}', new User('A'), {
          includeInherited: true,
        }),
      ).toBe('Hello, A');
    });

    it('includeInherited: trueでも関数は値として使わない', () => {
      expect(
        replacePlaceholders('{{toString}}', {}, { includeInherited: true }),
      ).toBe('{{toString}}');
    });
  });
});
