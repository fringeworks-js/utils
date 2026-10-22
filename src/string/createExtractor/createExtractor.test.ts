import { expectTypeOf } from 'vitest';
import createExtractor from './createExtractor';

const CASES = [
  {
    delimiters: ['{{', '}}'] as const,
    str: '{{ABC}}DEFG{{ HIJ}}KL{MNO}PQRSTUVW{{XYZ }}{{ABC}}',
    raw: ['{{ABC}}', '{{ HIJ}}', '{{XYZ }}', '{{ABC}}'],
  },
  {
    delimiters: ['${', '}'] as const,
    str: '${ABC}DEFG${ HIJ}KL{MNO}PQRSTUVW${XYZ }${ABC}',
    raw: ['${ABC}', '${ HIJ}', '${XYZ }', '${ABC}'],
  },
  {
    delimiters: ['[', ']'] as const,
    str: '[ABC]DEFG[ HIJ]KLMNOPQRSTUVW[XYZ ][ABC]',
    raw: ['[ABC]', '[ HIJ]', '[XYZ ]', '[ABC]'],
  },
  {
    delimiters: '|',
    str: '|ABC|DEFG| HIJ|KLMNOPQRSTUVW|XYZ ||ABC|',
    raw: ['|ABC|', '| HIJ|', '|XYZ |', '|ABC|'],
  },
  {
    delimiters: '★',
    str: '★ABC★DEFG★ HIJ★KLMNOPQRSTUVW★XYZ ★★ABC★',
    raw: ['★ABC★', '★ HIJ★', '★XYZ ★', '★ABC★'],
  },
];

describe('createExtractor', () => {
  describe.each(CASES)(
    'delimiters: $delimiters',
    ({ delimiters, str, raw }) => {
      const extract = createExtractor(delimiters);

      it('囲み文字の内側を前後の空白を除いて返す', () => {
        expect(extract(str)).toEqual(['ABC', 'HIJ', 'XYZ', 'ABC']);
      });

      it('keepWhitespace: trueで前後の空白を残す', () => {
        expect(extract(str, { keepWhitespace: true })).toEqual([
          'ABC',
          ' HIJ',
          'XYZ ',
          'ABC',
        ]);
      });

      it('keepDelimiters: trueで囲み文字を含めて元の文字列のまま返す', () => {
        expect(extract(str, { keepDelimiters: true })).toEqual(raw);
      });

      it('unique: trueで重複を除く', () => {
        expect(extract(str, { unique: true })).toEqual(['ABC', 'HIJ', 'XYZ']);
      });
    },
  );

  it('既定の囲み文字は{{ }}', () => {
    const extract = createExtractor();
    expect(extract('{{a}} {b}')).toEqual(['a']);
    expect(extract.prefix).toBe('{{');
    expect(extract.suffix).toBe('}}');
  });

  it('空の囲み文字は既定の囲み文字にする', () => {
    expect(createExtractor('')('{{a}}b')).toEqual(['a']);
    expect(createExtractor(['', '}'])('{{a}}b')).toEqual(['a']);
  });

  it('前後の空白を除いた結果が重複する場合はuniqueで除く', () => {
    expect(createExtractor()('{{a}} {{ a }}', { unique: true })).toEqual(['a']);
  });

  it('囲み文字の内側に改行を含むものは抽出しない', () => {
    expect(createExtractor()('{{a\nb}} {{c}}')).toEqual(['c']);
    expect(createExtractor()('{{a\n}}')).toEqual([]);
  });

  it('囲み文字の内側が空のものは空文字として返す', () => {
    expect(createExtractor()('{{}}{{ }}')).toEqual(['', '']);
  });

  it('囲み文字が異なる関数を交互に使っても、それぞれの囲み文字で抽出する', () => {
    const extractBraces = createExtractor();
    const extractPercent = createExtractor('%');
    expect(extractBraces('{{a}} %b%')).toEqual(['a']);
    expect(extractPercent('{{a}} %b%')).toEqual(['b']);
    expect(extractBraces('{{c}}')).toEqual(['c']);
  });

  it('readonlyの組を受け取る', () => {
    const delimiters = ['<', '>'] as const;
    expect(createExtractor(delimiters)('<a>')).toEqual(['a']);
  });

  describe('マッチなし', () => {
    it('囲み文字が含まれない文字列は空配列を返す', () => {
      expect(createExtractor()('no placeholders here')).toEqual([]);
    });

    it('空文字は空配列を返す', () => {
      const extract = createExtractor();
      expect(extract('')).toEqual([]);
    });
  });

  it('prefix・suffixはreadonly', () => {
    expectTypeOf(createExtractor()).toHaveProperty('prefix');
    // @ts-expect-error readonlyのため代入できない
    createExtractor().prefix = '[';
  });
});
