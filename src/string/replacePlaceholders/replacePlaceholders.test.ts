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

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = replacePlaceholders.dataLast({ name: 'Alice' })(
        '{{name}}さん',
      );
      expect(result).toBe('Aliceさん');
    });
  });
  it('delimitersに単一の文字列を指定すると開始・終了共通になる', () => {
    expect(
      replacePlaceholders('%name%さん', { name: 'Alice' }, { delimiters: '%' }),
    ).toBe('Aliceさん');
  });
});
