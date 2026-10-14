import _escapeRegExp from '../_internal/_escapeRegExp';
import escapeRegExp from './escapeRegExp';

const nativeEscape = (
  RegExp as RegExpConstructor & { escape?: (str: string) => string }
).escape;

const SAMPLES = [
  '',
  'hello',
  '1.5*2',
  'a.b*c+d?e^f$g',
  'a{1,3}[abc](x)|y\\z/w',
  'a-b,c=d<e>f#g&h!i%j:k;l@m~n\'o"p`q',
  '_under_score_',
  ' \t\n\v\f\r   ﻿　',
  '日本語',
  '\u{1f600}',
  '&&!!##',
];

describe('escapeRegExp', () => {
  it('構文の文字はバックスラッシュでエスケープする', () => {
    expect(escapeRegExp('_.*+?^$|')).toBe('_\\.\\*\\+\\?\\^\\$\\|');
    expect(escapeRegExp('_()[]{}')).toBe('_\\(\\)\\[\\]\\{\\}');
    expect(escapeRegExp('_\\/')).toBe('_\\\\\\/');
  });

  it('その他の区切り文字は16進数でエスケープする', () => {
    expect(escapeRegExp('_-,&')).toBe('_\\x2d\\x2c\\x26');
  });

  it('先頭の英数字は16進数でエスケープする', () => {
    expect(escapeRegExp('hello')).toBe('\\x68ello');
    expect(escapeRegExp('1.5')).toBe('\\x31\\.5');
  });

  it('空白・改行をエスケープする', () => {
    expect(escapeRegExp('_ \t\n ')).toBe('_\\x20\\t\\n\\u2028');
  });

  it('サロゲートペアはそのまま残し、単独のサロゲートはエスケープする', () => {
    expect(escapeRegExp('_\u{1f600}')).toBe('_\u{1f600}');
    expect(escapeRegExp('_\ud800')).toBe('_\\ud800');
  });

  it('空文字は空文字を返す', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it.runIf(nativeEscape).each([...SAMPLES, 'x\ud800y\udc00z'])(
    '%j を標準の RegExp.escape と同じ結果にする',
    (input) => {
      expect(_escapeRegExp(input)).toBe(nativeEscape!(input));
    },
  );

  it.each(['', 'u', 'v'])(
    'フラグ "%s" の正規表現で元の文字列に一致する',
    (flags) => {
      for (const input of SAMPLES) {
        const regex = new RegExp(`^${_escapeRegExp(input)}$`, flags);
        expect(regex.test(input)).toBe(true);
      }
    },
  );

  it.each(['', 'u', 'v'])(
    'フラグ "%s" の文字クラスの中で使用しても範囲指定や集合演算にならない',
    (flags) => {
      const regex = new RegExp(`^[${_escapeRegExp('a-c&&')}]$`, flags);
      expect(regex.test('-')).toBe(true);
      expect(regex.test('&')).toBe(true);
      expect(regex.test('b')).toBe(false);
    },
  );
});
