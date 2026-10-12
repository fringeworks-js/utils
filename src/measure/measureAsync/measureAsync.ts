import type { MeasureAsyncOptions, MeasureAsyncResult } from './types';

/**
 * 関数を指定回数実行しかかった時間を測定する
 * @param fn 測定対象の関数
 * @param args 測定対象の関数を実行する際に渡す引数
 * @param iterations 実行回数。未指定の場合は10回
 * @returns
 */
export default function measureAsync<
  A extends unknown[] = unknown[],
  R = unknown,
>(
  fn: (...args: A) => Promise<R>,
  options: MeasureAsyncOptions<A> = {},
): Promise<MeasureAsyncResult<R>> {
  const {
    iterations = 10,
    args = [] as unknown as A,
    getArgs = () => args,
  } = options;
  // 指定回数分実行
  let promise = Promise.resolve<MeasureAsyncResult<R>>({
    time: 0,
    returnValue: undefined,
  });
  for (let i = 0; i < iterations; i++) {
    promise = promise.then((previousResult) => {
      // 引数の取得
      const currentArgs = getArgs();
      return new Promise((resolve, reject) => {
        // 計測
        const start = performance.now();
        fn(...currentArgs)
          .then((returnValue) => {
            const time = previousResult.time + performance.now() - start;
            // 次に渡す
            resolve({ time, returnValue });
            return returnValue;
          })
          .catch((e) => reject(e));
      });
    });
  }
  return promise;
}
