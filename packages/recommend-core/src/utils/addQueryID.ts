export function addQueryID<THit>(hit: THit, queryID?: string): THit {
  if (!queryID) {
    return hit;
  }

  return {
    ...hit,
    __queryID: queryID,
  };
}
