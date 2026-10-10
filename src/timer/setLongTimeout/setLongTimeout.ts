// JavaScriptのsetTimeoutの最大値
const MAX_DELAY = 2 ** 31 - 1;

/**
 * JavaScriptのsetTimeoutの最大値を超える遅延時間を設定できる関数
 * @param callback コールバック関数
 * @param delay 遅延時間（ミリ秒）
 * @returns キャンセル用関数
 */
export default function setLongTimeout(
  callback: () => void,
  delay: number,
): () => void {
  if (delay <= MAX_DELAY) {
    const id = setTimeout(callback, delay);
    return () => {
      clearTimeout(id);
    };
  } else {
    const idRef = _setLongTimeout(callback, MAX_DELAY, delay - MAX_DELAY);
    return () => {
      clearTimeout(idRef.current);
    };
  }
}

function _setLongTimeout(callback: () => void, delay: number, rest: number) {
  const idRef: { current: NodeJS.Timeout } = { current: null };
  idRef.current = setTimeout(() => {
    if (rest > MAX_DELAY) {
      const { current } = _setLongTimeout(
        callback,
        MAX_DELAY,
        rest - MAX_DELAY,
      );
      idRef.current = current;
    } else if (rest > 0) {
      const { current } = _setLongTimeout(callback, rest, 0);
      idRef.current = current;
    } else {
      callback();
    }
  }, delay);
  return idRef;
}
