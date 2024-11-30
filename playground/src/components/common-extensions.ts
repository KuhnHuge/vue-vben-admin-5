export function formatWithCommas(input: number | string): string {
  // 转换输入为数字
  const number = typeof input === 'string' ? Number.parseFloat(input) : input;

  // 检查是否为有效数字
  if (Number.isNaN(number)) {
    return '';
  }

  // 使用 toLocaleString 添加逗号
  return number.toLocaleString();
}
