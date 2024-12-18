import { RecommendClient, TrendingFacetsQuery } from '@algolia/recommend';

import { TrendingFacetHit } from './types';
import { mapByScoreToRecommendations } from './utils';
import { version } from './version';

export type TrendingFacetsProps = {
  /**
   * The initialized Algolia recommend client.
   */
  recommendClient: RecommendClient;
  /**
   * A function to transform the retrieved items before passing them to the component.
   *
   * It’s useful to add or remove items, change them, or reorder them.
   */
  transformItems?: (items: TrendingFacetHit[]) => TrendingFacetHit[];
};

export type GetTrendingFacetsResult = {
  recommendations: TrendingFacetHit[];
};

export type GetTrendingFacetsProps = TrendingFacetsProps & TrendingFacetsQuery;

export function getTrendingFacets({
  recommendClient,
  transformItems = (x) => x,
  indexName,
  maxRecommendations,
  threshold,
  facetName,
}: GetTrendingFacetsProps) {
  const query = {
    indexName,
    maxRecommendations,
    threshold,
    facetName,
  };

  recommendClient.addAlgoliaAgent('recommend-core', version);

  return recommendClient
    .getTrendingFacets([query])
    .then((response) =>
      mapByScoreToRecommendations<TrendingFacetHit>({
        maxRecommendations,
        hits: response.results.map((result) => result.hits).flat(),
        indexName,
      })
    )
    .then((hits) => ({ recommendations: transformItems(hits) }));
}
