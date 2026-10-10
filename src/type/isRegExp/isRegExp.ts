import { getRawType } from '../getRawType';

export default function isRegExp(value: unknown): value is RegExp {
  return getRawType(value) === '[object RegExp]';
}
