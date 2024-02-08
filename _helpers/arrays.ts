export function randomize<A>(array: A[]): A[] {
  const result = [...array]
  result.sort(() => (Math.random() < 0.5 ? -1 : 1))
  return result
}
