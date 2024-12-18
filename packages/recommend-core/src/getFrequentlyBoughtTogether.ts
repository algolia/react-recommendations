import { FrequentlyBoughtTogetherQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { addAbsolutePosition } from './utils/addAbsolutePosition';
import { addIndexName } from './utils/addIndexName';
import { version } from './version';

export type GetFrequentlyBoughtTogetherProps<
  TObject
> = RecommendationsProps<TObject> &
  Omit<FrequentlyBoughtTogetherQuery, 'objectID'>;

export function getFrequentlyBoughtTogether<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
}: GetFrequentlyBoughtTogetherProps<TObject>) {
  const queries = objectIDs.map((objectID) => ({
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  recommendClient.addAlgoliaAgent('recommend-core', version);

  if (queries.length === 0) {
    return Promise.resolve({ recommendations: [] });
  }

  return recommendClient
    .getFrequentlyBoughtTogether<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
        queryIDs: response.results.map((res) => res.queryID),
      })
    )
    .then((hits) =>
      hits
        .map((hit) => addIndexName(hit, indexName))
        .map((hit, idx) => addAbsolutePosition(hit, idx))
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
