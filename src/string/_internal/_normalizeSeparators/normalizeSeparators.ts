/**
 * remeda が単語の区切りとして扱わない文字を空白に置き換える
 *
 * to*Case が出力するケースの区切り文字（空白・`_`・`-`・`.`）を、
 * すべて入力の区切りとしても扱えるようにする。
 */
const normalizeSeparators = (data: string): string => data.replaceAll('.', ' ');
export default normalizeSeparators;
