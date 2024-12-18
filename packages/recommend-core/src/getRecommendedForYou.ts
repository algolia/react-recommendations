import { Hit } from '@algolia/client-search';
import { RecommendClient, RecommendedForYouParams } from '@algolia/recommend';

import { addAbsolutePosition } from './utils/addAbsolutePosition';
import { addIndexName } from './utils/addIndexName';
import { addQueryID } from './utils/addQueryID';
import { version } from './version';

export type GetRecommendedForYouProps<TObject> = {
  /**
   * The initialized Algolia recommend client.
   */
  recommendClient: RecommendClient;
  /**
   * A function to transform the retrieved items before passing them to the component.
   * It’s useful to add or remove items, change them, or reorder them.
   */
  transformItems?: (items: Array<Hit<TObject>>) => Array<Hit<TObject>>;
} & RecommendedForYouParams;

export function getRecommendedForYou<TObject>({
  indexName,
  threshold,
  queryParameters,
  recommendClient,
  maxRecommendations,
  transformItems = (x) => x,
}: GetRecommendedForYouProps<TObject>) {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  const queries: RecommendedForYouParams[] = [
    {
      indexName,
      threshold,
      queryParameters,
      maxRecommendations,
    },
  ];

  return recommendClient
    .getRecommendedForYou<TObject>(queries)
    .then((response) => ({
      recommendations: transformItems(
        response.results
          .map((result) =>
            result.hits
              .map((hit) => addIndexName(hit, indexName))
              .map((hit) => addQueryID(hit, result.queryID))
          )
          .flat()
          .map((hit, idx) => addAbsolutePosition(hit, idx))
      ),
    }));
}
