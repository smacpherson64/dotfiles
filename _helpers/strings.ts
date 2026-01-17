export function cut(
  { from, to }: { from: number; to: number },
  string: string,
) {
  const result = string.slice(0, from) + string.slice(to);
  return result;
}
