import {
  getRecommendations,
  GetRecommendationsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseRecommendationsProps<
  TObject
> = GetRecommendationsProps<TObject> & { enabled?: boolean };

export function useRecommendations<TObject>({
  enabled = true,
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  model,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
}: UseRecommendationsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setStatus('loading');
    getRecommendations({
      fallbackParameters,
      indexName,
      maxRecommendations,
      model,
      objectIDs,
      queryParameters,
      recommendClient,
      threshold,
      transformItems: transformItemsRef.current,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [
    enabled,
    fallbackParameters,
    indexName,
    maxRecommendations,
    model,
    objectIDs,
    queryParameters,
    recommendClient,
    setStatus,
    threshold,
  ]);

  return {
    ...result,
    status,
  };
}
