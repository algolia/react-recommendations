import {
  BatchQuery,
  GetRecommendationsResult,
  getTrendingItems,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { UseTrendingItemsProps } from './TrendingItems';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useTrendingItems<TObject>({
  enabled = true,
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
  facetName,
  facetValue,
}: UseTrendingItemsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const { hasProvider, register } = useRecommendContext<
    GetRecommendationsResult<TObject>
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

    const param: BatchQuery<TObject> = {
      model: 'trending-items',
      fallbackParameters,
      indexName,
      maxRecommendations,
      queryParameters,
      threshold,
      facetName,
      facetValue,
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
    getTrendingItems({
      ...param,
      recommendClient: client,
      transformItems: transformItemsRef.current,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
    return () => {};
  }, [
    enabled,
    fallbackParameters,
    indexName,
    maxRecommendations,
    queryParameters,
    client,
    setStatus,
    threshold,
    facetName,
    facetValue,
    hasProvider,
    isContextClient,
    register,
  ]);

  return {
    ...result,
    status,
  };
}
