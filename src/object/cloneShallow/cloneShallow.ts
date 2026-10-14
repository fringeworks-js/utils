import _setProperty from '../../_internal/_setProperty';
import { hasOwn } from '../hasOwn';

/**
 * 浅いコピーをする。未対応のものはそのまま返す。
 *
 * Inspired by klona/full (https://github.com/lukeed/klona)
 *
 * Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 * MIT License: https://github.com/lukeed/klona/blob/master/license
 *
 * @param value
 * @returns
 */
export default function cloneShallow<T>(value: T): T {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  const type = Object.prototype.toString.call(value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const original = value as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let copy: any;

  // コピーのベースになるものを作る
  if (type === '[object Object]') {
    copy = Object.create(Object.getPrototypeOf(original));
  } else if (type === '[object Array]') {
    // 要素は slice でまとめて複製する（空き要素も保たれる）
    copy = original.slice();
  } else if (type === '[object Set]') {
    copy = new Set(original as Set<unknown>);
  } else if (type === '[object Map]') {
    copy = new Map(original as Map<unknown, unknown>);
  } else if (type === '[object Date]') {
    copy = new Date(original.getTime());
  } else if (type === '[object RegExp]') {
    copy = new RegExp(original.source, original.flags);
  } else if (type === '[object DataView]') {
    copy = new original.constructor(
      original.buffer,
      original.byteOffset,
      original.byteLength,
    );
  } else if (type === '[object ArrayBuffer]') {
    copy = original.slice(0);
  } else if (type.slice(-6) === 'Array]') {
    copy = new original.constructor(original);
  }

  if (copy) {
    // シンボルのプロパティ
    for (const symbol of Object.getOwnPropertySymbols(original)) {
      _setProperty(
        copy,
        symbol,
        Object.getOwnPropertyDescriptor(original, symbol),
      );
    }
    // 通常のプロパティ
    // 配列の要素など、コピーのベースを作った時点で同じ値になっているものは飛ばす
    for (const key of Object.getOwnPropertyNames(original)) {
      if (!hasOwn(copy, key) || !Object.is(copy[key], original[key])) {
        _setProperty(copy, key, Object.getOwnPropertyDescriptor(original, key));
      }
    }
    return copy;
  } else {
    // 対応していない型はそのまま返す
    return original;
  }
}
