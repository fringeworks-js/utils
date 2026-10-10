import _setProperty from '../../_internal/_setProperty';

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
    // 長さだけ確保した疎な配列
    copy = Array(original.length);
  } else if (type === '[object Set]') {
    copy = new Set();
    original.forEach((val) => {
      copy.add(val);
    });
    // Setは要素を追加するだけでOK
    return copy;
  } else if (type === '[object Map]') {
    copy = new Map();
    original.forEach((val, key) => {
      copy.set(key, val);
    });
    // Mapは要素を追加するだけでOK
    return copy;
  } else if (type === '[object Date]') {
    copy = new Date(original.getTime());
  } else if (type === '[object RegExp]') {
    copy = new RegExp(original.source, original.flags);
  } else if (type === '[object DataView]') {
    copy = new original.constructor(original.buffer);
  } else if (type === '[object ArrayBuffer]') {
    copy = original.slice(0);
  } else if (type.slice(-6) === 'Array]') {
    copy = new original.constructor(original);
  }

  if (copy) {
    // シンボルのプロパティ
    const symbols = Object.getOwnPropertySymbols(original);
    for (let i = 0; i < symbols.length; i++) {
      _setProperty(
        copy,
        symbols[i],
        Object.getOwnPropertyDescriptor(original, symbols[i]),
      );
    }
    // 通常のプロパティ
    const names = Object.getOwnPropertyNames(original);
    for (let i = 0; i < names.length; i++) {
      const key = names[i];
      if (!Object.hasOwn(copy, key) || copy[key] !== original[key]) {
        _setProperty(copy, key, Object.getOwnPropertyDescriptor(original, key));
      }
    }
    return copy;
  } else {
    // 対応していない型はそのまま返す
    return original;
  }
}
