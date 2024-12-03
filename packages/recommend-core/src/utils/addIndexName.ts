export function addIndexName<THit>(hit: THit, indexName: string): THit {
  return {
    ...hit,
    __indexName: indexName,
  };
}
