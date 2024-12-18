import { TrendingModel } from '@algolia/recommend';
import {
  getTrendingFacets,
  GetTrendingFacetsResult,
  BatchRecommendations,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { UseTrendingFacetsProps } from './TrendingFacets';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

export function useTrendingFacets({
  enabled = true,
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

  const { hasProvider, register } = useRecommendContext<
    BatchRecommendations<undefined>
  >();
  const { client, isContextClient } = useRecommendClient(recommendClient);

  useAlgoliaAgent({ recommendClient: client });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

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
          setResult({
            ...response,
            recommendations: response.trendingFacets,
          });
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
    enabled,
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
