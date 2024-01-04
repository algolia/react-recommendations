import { RecommendClient, TrendingItemsQuery } from '@algolia/recommend';

import { getPersonalizationFilters } from './personalization';
import { ProductRecord } from './types';
import { Experimental } from './types/Experimental';
import { mapByScoreToRecommendations, uniqBy } from './utils';
import { version } from './version';

export type TrendingItemsProps<TObject> = {
  /**
   * The initialized Algolia recommend client.
   */
  recommendClient: RecommendClient;
  /**
   * A function to transform the retrieved items before passing them to the component.
   *
   * It’s useful to add or remove items, change them, or reorder them.
   */
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;

  /**
   * Experimental features not covered by SLA and semantic versioning conventions.
   */
  experimental?: Experimental;
};

export type GetTrendingItemsResult<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
};

export type GetTrendingItemsProps<TObject> = TrendingItemsProps<TObject> &
  TrendingItemsQuery;

export function getTrendingItems<TObject>({
  recommendClient,
  transformItems = (x) => x,
  fallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters,
  threshold,
  facetName,
  facetValue,
  experimental,
}: GetTrendingItemsProps<TObject>) {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  /**
   * Big block of duplicated code, but it is fine since it is experimental and will be ported to the API eventually.
   * This is a temporary solution to get recommended personalization.
   */
  if (
    experimental?.personalization?.enabled &&
    experimental?.personalization?.region
  ) {
    return getPersonalizationFilters({
      apiKey: recommendClient.transporter.queryParameters['x-algolia-api-key'],
      appId: recommendClient.appId,
      region: experimental.personalization.region,
      userToken: experimental.personalization.userToken,
      cache: experimental.personalization.cache,
    }).then((personalizationFilters) => {
      const query = {
        fallbackParameters,
        indexName,
        maxRecommendations,
        threshold,
        facetName,
        facetValue,
        queryParameters: {
          ...queryParameters,
          optionalFilters: [
            ...personalizationFilters,
            ...(queryParameters?.optionalFilters ?? []),
          ],
        },
      };

      return recommendClient
        .getTrendingItems<TObject>([query])
        .then((response) =>
          mapByScoreToRecommendations<ProductRecord<TObject>>({
            maxRecommendations,
            // Multiple identical recommended `objectID`s can be returned b
            // the engine, so we need to remove duplicates.
            hits: uniqBy<ProductRecord<TObject>>(
              'objectID',
              response.results.map((result) => result.hits).flat()
            ),
          })
        )
        .then((hits) => ({ recommendations: transformItems(hits) }));
    });
  }

  const query = {
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    threshold,
    facetName,
    facetValue,
  };

  return recommendClient
    .getTrendingItems<TObject>([query])
    .then((response) =>
      mapByScoreToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        // Multiple identical recommended `objectID`s can be returned b
        // the engine, so we need to remove duplicates.
        hits: uniqBy<ProductRecord<TObject>>(
          'objectID',
          response.results.map((result) => result.hits).flat()
        ),
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
