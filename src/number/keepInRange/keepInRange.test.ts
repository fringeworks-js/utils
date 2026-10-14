import { RangeMode } from './constants';
import keepInRange from './keepInRange';

describe('keepInRange', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(keepInRange(5, 0, 10)).toBe(5);
  });

  describe('mode: clamp (デフォルト)', () => {
    it('最小値より小さい場合は最小値を返す', () => {
      expect(keepInRange(-1, 0, 10)).toBe(0);
    });

    it('最大値より大きい場合は最大値を返す', () => {
      expect(keepInRange(11, 0, 10)).toBe(10);
    });
  });

  describe('mode: loop', () => {
    it('最大値を超えるとループする', () => {
      expect(keepInRange(11, 0, 10, { mode: 'loop' })).toBe(1);
    });

    it('最小値より小さい場合は後ろからループする', () => {
      expect(keepInRange(-1, 0, 10, { mode: 'loop' })).toBe(9);
    });
  });

  describe('mode: pingpong', () => {
    it('最大値+1は折り返す', () => {
      expect(keepInRange(11, 0, 10, { mode: 'pingpong' })).toBe(9);
    });
  });

  describe('mode: min', () => {
    it('範囲外は最小値を返す', () => {
      expect(keepInRange(15, 0, 10, { mode: 'min' })).toBe(0);
      expect(keepInRange(-1, 0, 10, { mode: 'min' })).toBe(0);
    });
  });

  describe('mode: max', () => {
    it('範囲外は最大値を返す', () => {
      expect(keepInRange(15, 0, 10, { mode: 'max' })).toBe(10);
      expect(keepInRange(-1, 0, 10, { mode: 'max' })).toBe(10);
    });
  });

  describe('mode: replace', () => {
    it('範囲外はoutOfRangeValueを返す', () => {
      expect(
        keepInRange(15, 0, 10, { mode: 'replace', outOfRangeValue: -1 }),
      ).toBe(-1);
    });

    it('outOfRangeValueの既定値は0', () => {
      expect(keepInRange(15, 1, 10, { mode: 'replace' })).toBe(0);
    });

    it('belowMinValue・aboveMaxValueで上下別に指定できる', () => {
      const options = {
        mode: 'replace',
        belowMinValue: -1,
        aboveMaxValue: 99,
      } as const;
      expect(keepInRange(-5, 0, 10, options)).toBe(-1);
      expect(keepInRange(15, 0, 10, options)).toBe(99);
    });
  });

  it('RangeModeの定数で指定できる', () => {
    expect(keepInRange(15, 0, 10, { mode: RangeMode.loop })).toBe(5);
  });

  describe('minMode/maxMode', () => {
    it('最小値未満はloop、最大値超過はclamp', () => {
      expect(
        keepInRange(-1, 0, 10, { minMode: 'loop', maxMode: 'clamp' }),
      ).toBe(9);
      expect(
        keepInRange(11, 0, 10, { minMode: 'loop', maxMode: 'clamp' }),
      ).toBe(10);
    });
  });

  it('min が max より大きい場合は入れ替えて扱う', () => {
    expect(keepInRange(15, 10, 0)).toBe(10);
    expect(keepInRange(-1, 10, 0, { minMode: 'max' })).toBe(10);
    expect(keepInRange(15, 10, 0, { mode: 'loop' })).toBe(5);
  });

  it('loopの場合、最大値ちょうどは最小値になる', () => {
    expect(keepInRange(10, 0, 10, { mode: 'loop' })).toBe(0);
    expect(keepInRange(10, 0, 10)).toBe(10);
  });
});
