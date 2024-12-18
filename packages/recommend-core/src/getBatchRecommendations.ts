import {
  RecommendClient,
  RecommendationsQuery,
  TrendingQuery,
  RecommendedForYouQuery,
} from '@algolia/recommend';

import { TrendingFacetHit, ProductRecord } from './types';
import { mapByScoreToRecommendations, mapToRecommendations } from './utils';
import { addAbsolutePosition } from './utils/addAbsolutePosition';
import { addIndexName } from './utils/addIndexName';
import { version } from './version';

export type BatchKeyPair = {
  key: string;
  value: number;
};

export type BatchQuery<TObject> = (
  | RecommendationsQuery
  | TrendingQuery
  | RecommendedForYouQuery
) & {
  transformItems?: (
    items: Array<ProductRecord<TObject>>
  ) => Array<ProductRecord<TObject>>;
};

export type GetBatchRecommendations<TObject> = {
  keys: BatchKeyPair[];
  queries: Array<BatchQuery<TObject>>;
  recommendClient: RecommendClient;
};

export type BatchRecommendations<TObject> = {
  recommendations: Array<ProductRecord<TObject>>;
  trendingFacets: TrendingFacetHit[];
};

export async function getBatchRecommendations<TObject>({
  keys,
  queries,
  recommendClient,
}: GetBatchRecommendations<TObject>): Promise<
  Record<string, BatchRecommendations<TObject>>
> {
  recommendClient.addAlgoliaAgent('recommend-core', version);

  const response = await recommendClient.getRecommendations<TObject>(queries);

  let prevChunks = 0;
  let allChunks = 0;

  const results: Record<string, BatchRecommendations<TObject>> = {};

  keys.forEach((keyPair) => {
    const { model } = JSON.parse(keyPair.key);

    allChunks += keyPair.value;
    const {
      indexName,
      maxRecommendations,
      transformItems = (x) => x,
    } = queries[prevChunks];
    const splitResult = response?.results?.slice(prevChunks, allChunks);
    prevChunks += keyPair.value;

    let recommendations: Array<ProductRecord<ProductRecord<TObject>>> = [];
    let trendingFacets: TrendingFacetHit[] = [];
    if (model === 'trending-facets') {
      trendingFacets = splitResult
        .map((res) => (res.hits as unknown) as TrendingFacetHit[])
        .flat();
    } else if (model === 'trending-items') {
      recommendations = mapByScoreToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: splitResult.map((res) => res.hits).flat(),
        indexName,
        queryID: splitResult.at(0)?.queryID,
      });
    } else {
      recommendations = mapToRecommendations<ProductRecord<TObject>>({
        maxRecommendations,
        hits: splitResult.map((res) => res.hits),
        nrOfObjs: keyPair.value,
        queryIDs: splitResult.map((res) => res.queryID),
      })
        .map((hit) => addIndexName(hit, indexName))
        .map((hit, idx) => addAbsolutePosition(hit, idx));
    }
    recommendations = transformItems(recommendations);
    results[keyPair.key] = { recommendations, trendingFacets };
  });

  return results;
}
