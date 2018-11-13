export function inRange(
  { length }: { length: number },
  min: number,
  max: number
): boolean {
  return length >= min && length <= max;
}
