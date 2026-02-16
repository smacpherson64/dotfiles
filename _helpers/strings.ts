export function cut(
  { from, to }: { from: number; to: number },
  string: string,
) {
  const result = string.slice(0, from) + string.slice(to);
  return result;
}

function normalizeForStringMatching(input?: unknown) {
  if (!input) return "";
  if (typeof input !== "string") return "";
  return input.toLocaleLowerCase().trim();
}

export function matchStrings(rawSource?: string, rawSearch?: string) {
  const source = normalizeForStringMatching(rawSource);
  const search = normalizeForStringMatching(rawSearch);

  return source === search || source.includes(search);
}
