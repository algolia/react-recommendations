import { RelatedProductsQuery } from '@algolia/recommend';

import { RecommendationsProps } from './getRecommendations';
import { getPersonalizationFilters } from './personalization';
import { ProductRecord } from './types';
import { mapToRecommendations } from './utils';
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
  region,
  userToken,
}: GetRelatedProductsProps<TObject>) {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  /**
   * Big block of duplicated code, but it is fine since it is experimental and will be ported to the API eventually.
   * This is a temporary solution to get recommended personalization.
   */
  if (region && userToken) {
    return getPersonalizationFilters({
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appId: recommendClient.appId,
      region,
      userToken,
    }).then((personalizationFilters) => {
      const queries = objectIDs.map((objectID) => ({
        fallbackParameters,
        indexName,
        maxRecommendations,
        objectID,
        threshold,
        queryParameters: {
          ...queryParameters,
          optionalFilters: [
            ...personalizationFilters,
            ...(queryParameters?.optionalFilters ?? []),
          ],
        },
      }));

      return recommendClient
        .getRelatedProducts<TObject>(queries)
        .then((response) =>
          mapToRecommendations<ProductRecord<TObject>>({
            maxRecommendations,
            hits: response.results.map((result) => result.hits),
            nrOfObjs: objectIDs.length,
          })
        )
        .then((hits) => ({ recommendations: transformItems(hits) }));
    });
  }

  const queries = objectIDs.map((objectID) => ({
    fallbackParameters,
    indexName,
    maxRecommendations,
    objectID,
    queryParameters,
    threshold,
  }));

  return recommendClient
    .getRelatedProducts<TObject>(queries)
    .then((response) =>
      mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits),
        nrOfObjs: objectIDs.length,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
