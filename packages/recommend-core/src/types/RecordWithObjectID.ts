export type RecordWithObjectID<TObject = {}> = TObject & {
  objectID: string;
  __queryID?: string;
  __position?: number;
  __indexName?: string;
};
