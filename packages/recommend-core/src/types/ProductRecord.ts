export type ProductRecord<TObject> = TObject & {
  objectID: string;
  _score?: number;
  __queryID?: string;
  __position?: number;
  __indexName?: string;
};
