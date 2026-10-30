import createStringMatcher from './createStringMatcher';
import type { StringCondition } from './types';

describe('createStringMatcher', () => {
  describe('文字列', () => {
    it('完全一致', () => {
      const match = createStringMatcher('abc');
      expect(match('abc')).toBe(true);
      expect(match('abcd')).toBe(false);
      expect(match('xabc')).toBe(false);
      expect(match('ABC')).toBe(false);
    });

    it('空文字は空文字だけに一致する', () => {
      const match = createStringMatcher('');
      expect(match('')).toBe(true);
      expect(match('a')).toBe(false);
    });
  });

  describe('RegExp', () => {
    it('正規表現に一致する', () => {
      const match = createStringMatcher(/^on[A-Z]/);
      expect(match('onClick')).toBe(true);
      expect(match('online')).toBe(false);
    });

    it('gフラグ付きでも結果が変わらない', () => {
      const regExp = /a/g;
      const match = createStringMatcher(regExp);
      expect(match('a')).toBe(true);
      expect(match('a')).toBe(true);
      expect(match('ba')).toBe(true);
      expect(regExp.lastIndex).toBe(0);
    });
  });

  describe('StringComparison', () => {
    it('includes: 部分一致', () => {
      const match = createStringMatcher({ includes: 'bc' });
      expect(match('abcd')).toBe(true);
      expect(match('acbd')).toBe(false);
    });

    it('startsWith: 前方一致', () => {
      const match = createStringMatcher({ startsWith: 'on' });
      expect(match('onClick')).toBe(true);
      expect(match('button')).toBe(false);
    });

    it('endsWith: 後方一致', () => {
      const match = createStringMatcher({ endsWith: '.ts' });
      expect(match('index.ts')).toBe(true);
      expect(match('index.tsx')).toBe(false);
    });

    it('matches: 文字列を正規表現として比べる', () => {
      const match = createStringMatcher({ matches: '^on[A-Z]' });
      expect(match('onClick')).toBe(true);
      expect(match('online')).toBe(false);
    });

    it('matches: RegExpも受け付ける', () => {
      const match = createStringMatcher({ matches: /\.tsx?$/ });
      expect(match('a.tsx')).toBe(true);
      expect(match('a.js')).toBe(false);
    });

    it('matches: 正規表現として不正な文字列は一致しない', () => {
      const match = createStringMatcher({ matches: '(' });
      expect(match('(')).toBe(false);
    });

    it('複数の比べ方はすべてに合うときに一致する（AND）', () => {
      const match = createStringMatcher({
        startsWith: 'on',
        endsWith: 'Change',
      });
      expect(match('onValueChange')).toBe(true);
      expect(match('onClick')).toBe(false);
      expect(match('valueChange')).toBe(false);
    });

    it('不正な正規表現を含む場合は、ほかの比べ方に合っても一致しない', () => {
      const match = createStringMatcher({ includes: 'a', matches: '(' });
      expect(match('a')).toBe(false);
    });

    it('空文字の比べ方はすべてに一致する', () => {
      expect(createStringMatcher({ includes: '' })('abc')).toBe(true);
      expect(createStringMatcher({ startsWith: '' })('')).toBe(true);
    });

    it('比べ方が1つも無い場合は何にも一致しない', () => {
      const match = createStringMatcher({});
      expect(match('')).toBe(false);
      expect(match('abc')).toBe(false);
    });

    it('undefinedの比べ方は書いていないものとして扱う', () => {
      expect(createStringMatcher({ includes: undefined })('abc')).toBe(false);
      expect(
        createStringMatcher({ includes: 'a', startsWith: undefined })('ba'),
      ).toBe(true);
    });

    it('知らない名前の比べ方は無視する', () => {
      const typo = { startWith: 'on' } as StringCondition;
      expect(createStringMatcher(typo)('onClick')).toBe(false);
      const mixed = { startWith: 'x', includes: 'b' } as StringCondition;
      expect(createStringMatcher(mixed)('abc')).toBe(true);
    });
  });

  describe('関数', () => {
    it('真を返したときに一致する', () => {
      const match = createStringMatcher((value) => value.length === 3);
      expect(match('abc')).toBe(true);
      expect(match('ab')).toBe(false);
    });
  });

  describe('配列', () => {
    it('どれかに合うときに一致する（OR）', () => {
      const match = createStringMatcher([
        'id',
        /^on/,
        { endsWith: 'Ref' },
        (value) => value === 'x',
      ]);
      expect(match('id')).toBe(true);
      expect(match('onClick')).toBe(true);
      expect(match('inputRef')).toBe(true);
      expect(match('x')).toBe(true);
      expect(match('name')).toBe(false);
    });

    it('空の配列は何にも一致しない', () => {
      const match = createStringMatcher([]);
      expect(match('')).toBe(false);
      expect(match('a')).toBe(false);
    });

    it('入れ子の配列もORとして扱う', () => {
      const nested = ['a', ['b', ['c']]] as unknown as StringCondition;
      const match = createStringMatcher(nested);
      expect(match('a')).toBe(true);
      expect(match('b')).toBe(true);
      expect(match('c')).toBe(true);
      expect(match('d')).toBe(false);
    });

    it('型にない値は何にも一致しない', () => {
      const invalid = [null, 1] as unknown as StringCondition;
      expect(createStringMatcher(invalid)('1')).toBe(false);
    });
  });

  describe('ignoreCase', () => {
    it('文字列で比べる形は大文字・小文字を区別しない', () => {
      const options = { ignoreCase: true };
      expect(createStringMatcher('ABC', options)('abc')).toBe(true);
      expect(createStringMatcher({ includes: 'B' }, options)('abc')).toBe(true);
      expect(createStringMatcher({ startsWith: 'A' }, options)('abc')).toBe(
        true,
      );
      expect(createStringMatcher({ endsWith: 'C' }, options)('abc')).toBe(true);
    });

    it('正規表現はiフラグを付けて比べる', () => {
      const options = { ignoreCase: true };
      expect(createStringMatcher(/^abc$/, options)('ABC')).toBe(true);
      expect(createStringMatcher({ matches: '^abc$' }, options)('ABC')).toBe(
        true,
      );
      expect(createStringMatcher({ matches: /^abc$/g }, options)('ABC')).toBe(
        true,
      );
    });

    it('渡した正規表現は書き換えない', () => {
      const regExp = /abc/;
      createStringMatcher(regExp, { ignoreCase: true })('ABC');
      expect(regExp.flags).toBe('');
    });

    it('falseなら区別する', () => {
      expect(createStringMatcher('ABC', { ignoreCase: false })('abc')).toBe(
        false,
      );
    });
  });

  describe('normalize', () => {
    const normalize = (value: string) => value.normalize('NFKC');

    it('文字列で比べる形は、値と条件の両方を正規化する', () => {
      const options = { normalize };
      expect(createStringMatcher('ＡＢＣ', options)('ABC')).toBe(true);
      expect(createStringMatcher('ABC', options)('ＡＢＣ')).toBe(true);
      expect(createStringMatcher({ includes: 'Ｂ' }, options)('ABC')).toBe(
        true,
      );
    });

    it('正規表現は値だけを正規化する', () => {
      const options = { normalize };
      expect(createStringMatcher(/^ABC$/, options)('ＡＢＣ')).toBe(true);
      expect(createStringMatcher({ matches: '^ABC$' }, options)('ＡＢＣ')).toBe(
        true,
      );
    });

    it('関数には正規化する前の値を渡す', () => {
      const predicate = vi.fn(() => true);
      createStringMatcher(predicate, { normalize })('ＡＢＣ');
      expect(predicate).toHaveBeenCalledWith('ＡＢＣ');
    });

    it('ignoreCaseと組み合わせると、正規化してから小文字にする', () => {
      const match = createStringMatcher('abc', { normalize, ignoreCase: true });
      expect(match('ＡＢＣ')).toBe(true);
    });
  });
});
