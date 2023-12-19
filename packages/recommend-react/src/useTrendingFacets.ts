import { TrendingModel } from '@algolia/recommend';
import {
  getTrendingFacets,
  GetTrendingFacetsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { UseTrendingFacetsProps } from './TrendingFacets';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

export function useTrendingFacets({
  indexName,
  maxRecommendations,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  facetName,
}: UseTrendingFacetsProps) {
  const [result, setResult] = useState<GetTrendingFacetsResult>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  const {
    hasProvider,
    register,
  } = useRecommendContext<GetTrendingFacetsResult>();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const param = {
      model: 'trending-facets' as TrendingModel,
      indexName,
      facetName,
      threshold,
      maxRecommendations,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      return register({
        key,
        getParameters() {
          return {
            queries: [param],
            keyPair: {
              key,
              value: 1,
            },
          };
        },
        onRequest() {
          setStatus('loading');
        },
        onResult(response) {
          setResult(response);
          setStatus('idle');
        },
      });
    }

    setStatus('loading');
    getTrendingFacets({
      ...param,
      recommendClient: client,
      facetName,
      transformItems: transformItemsRef.current,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
    return () => {};
  }, [
    indexName,
    maxRecommendations,
    client,
    setStatus,
    threshold,
    facetName,
    hasProvider,
    isContextClient,
    register,
  ]);

  return {
    ...result,
    status,
  };
}
