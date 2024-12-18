export function addAbsolutePosition<THit>(hit: THit, index: number): THit {
  return {
    ...hit,
    __position: index + 1,
  };
}
