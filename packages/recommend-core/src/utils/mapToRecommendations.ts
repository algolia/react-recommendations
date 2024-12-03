import { ProductRecord } from '../types';
import { AverageIndices } from '../types/AverageIndices';
import { IndexTracker } from '../types/IndexTracker';

import { addQueryID } from './addQueryID';
import { getAverageIndices } from './computeAverageIndices';

/**
 * Returns the reordered list of recommendations based on average indices.
 *
 * @param hits - recommendations
 * @param maxRecommendations - max number of recommendations
 * @param nrOfObjs - total number of products for which we are retrieving recommendations (objectsIDs.length)
 */

type MapToRecommendations<TObject> = {
  hits: Array<Array<ProductRecord<TObject>>>;
  queryIDs: Array<string | undefined>;
  maxRecommendations?: number;
  nrOfObjs: number;
};

export function mapToRecommendations<TObject>({
  hits,
  maxRecommendations,
  nrOfObjs,
  queryIDs,
}: MapToRecommendations<TObject>): Array<ProductRecord<TObject>> {
  const indexTracker: IndexTracker = {};

  hits.forEach((hitsArray, idx) => {
    hitsArray
      .map((hit) => addQueryID(hit, queryIDs[idx]))
      .forEach((hit, index) => {
        if (!indexTracker[hit.objectID]) {
          indexTracker[hit.objectID] = { indexSum: index, nr: 1 };
        } else {
          indexTracker[hit.objectID] = {
            indexSum: indexTracker[hit.objectID].indexSum + index,
            nr: indexTracker[hit.objectID].nr + 1,
          };
        }
      });
  });

  const sortedAverageIndices = getAverageIndices(indexTracker, nrOfObjs);

  const finalOrder = sortedAverageIndices.reduce<Array<ProductRecord<TObject>>>(
    (
      orderedHits: Array<ProductRecord<TObject>>,
      avgIndexRef: AverageIndices
    ) => {
      const result = hits
        .flat()
        .find(
          (hit: ProductRecord<TObject>) => hit.objectID === avgIndexRef.objectID
        );
      return result ? orderedHits.concat(result) : orderedHits;
    },
    []
  );

  return finalOrder.slice(
    0,
    // We cap the number of recommendations because the previously
    // computed `hitsPerPage` was an approximation due to `Math.ceil`.
    maxRecommendations && maxRecommendations > 0
      ? maxRecommendations
      : undefined
  );
}
