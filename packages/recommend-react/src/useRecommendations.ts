import {
  getRecommendations,
  GetRecommendationsProps,
  GetRecommendationsResult,
  InitialState,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export type UseRecommendationsProps<TObject> = GetRecommendationsProps<TObject>;

export function useRecommendations<TObject>({
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  model,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems,
  initialState: userInitialState,
}: UseRecommendationsProps<TObject> & {
  initialState?: InitialState<TObject>;
}) {
  const isFirstRenderRef = useRef(true);

  const { status, setStatus } = useStatus(
    userInitialState ? 'idle' : 'loading'
  );
  const objectIDs = useStableValue(userObjectIDs);
  const queryParameters = useStableValue(userQueryParameters);
  const fallbackParameters = useStableValue(userFallbackParameters);

  const initialState = useStableValue<GetRecommendationsResult<TObject>>({
    recommendations: [],
    ...userInitialState,
  });
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>(
    initialState
  );

  useAlgoliaAgent({ recommendClient });

  const transformItemsRef = useRef(userTransformItems);
  useEffect(() => {
    transformItemsRef.current = userTransformItems;
  }, [userTransformItems]);

  useEffect(() => {
    const shouldFetch = !userInitialState || !isFirstRenderRef.current;

    if (shouldFetch) {
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
    }
    isFirstRenderRef.current = false;
  }, [
    userInitialState,
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
