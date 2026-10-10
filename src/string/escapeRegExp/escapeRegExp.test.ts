import escapeRegExp from './escapeRegExp';

describe('escapeRegExp', () => {
  it('特殊文字なし', () => {
    expect(escapeRegExp('hello')).toBe('hello');
  });

  it('ドット', () => {
    expect(escapeRegExp('a.b')).toBe('a\\.b');
  });

  it('アスタリスク', () => {
    expect(escapeRegExp('a*b')).toBe('a\\*b');
  });

  it('プラス', () => {
    expect(escapeRegExp('a+b')).toBe('a\\+b');
  });

  it('疑問符', () => {
    expect(escapeRegExp('a?b')).toBe('a\\?b');
  });

  it('キャレット', () => {
    expect(escapeRegExp('a^b')).toBe('a\\^b');
  });

  it('ドル記号', () => {
    expect(escapeRegExp('a$b')).toBe('a\\$b');
  });

  it('波括弧', () => {
    expect(escapeRegExp('a{1,3}')).toBe('a\\{1,3\\}');
  });

  it('角括弧', () => {
    expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
  });

  it('パイプ', () => {
    expect(escapeRegExp('a|b')).toBe('a\\|b');
  });

  it('丸括弧', () => {
    expect(escapeRegExp('(abc)')).toBe('\\(abc\\)');
  });

  it('バックスラッシュ', () => {
    expect(escapeRegExp('a\\b')).toBe('a\\\\b');
  });

  it('ハイフンは16進数でエスケープする', () => {
    expect(escapeRegExp('a-b')).toBe('a\\x2db');
  });

  it('正規表現として使用できること', () => {
    const input = 'a.b*c';
    const escaped = escapeRegExp(input);
    const regex = new RegExp(escaped);
    expect(regex.test(input)).toBe(true);
    expect(regex.test('aXbXc')).toBe(false);
  });

  it.each(['', 'u', 'v'])(
    'フラグ "%s" の正規表現として使用できること',
    (flags) => {
      const input = 'a-b.c[d]e{1}f|g\\h';
      const regex = new RegExp(`^${escapeRegExp(input)}$`, flags);
      expect(regex.test(input)).toBe(true);
    },
  );

  it('文字クラスの中で使用しても範囲指定にならないこと', () => {
    const regex = new RegExp(`^[${escapeRegExp('a-c')}]$`, 'u');
    expect(regex.test('-')).toBe(true);
    expect(regex.test('b')).toBe(false);
  });
});
