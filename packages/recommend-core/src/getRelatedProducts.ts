import { RelatedProductsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
import { addAbsolutePosition } from './utils/addAbsolutePosition';
import { addIndexName } from './utils/addIndexName';
import { version } from './version';

export type GetRelatedProductsProps<TObject> = RecommendationsProps<TObject> &
  Omit<RelatedProductsQuery, 'objectID'>;

export function getRelatedProducts<TObject>({
  objectIDs,
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
}: GetRelatedProductsProps<TObject>) {
  const queries = objectIDs.map((objectID) => ({
    fallbackParameters,
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
    .getRelatedProducts<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        queryIDs: response.results.map((result) => result.queryID),
        nrOfObjs: objectIDs.length,
      })
    )
    .then((hits) =>
      hits
        .map((hit) => addIndexName(hit, indexName))
        .map((hit, idx) => addAbsolutePosition(hit, idx))
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
