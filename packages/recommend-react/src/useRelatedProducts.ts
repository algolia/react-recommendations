import { RecommendationsQuery } from '@algolia/recommend';
import {
  getRelatedProducts,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import { useEffect, useRef, useState } from 'react';

import { useRecommendContext, useRecommendClient } from './RecommendContext';
import { UseRelatedProductsProps } from './RelatedProducts';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStableValue } from './useStableValue';
import { useStatus } from './useStatus';

export function useRelatedProducts<TObject>({
  enabled = true,
  fallbackParameters: userFallbackParameters,
  indexName,
  maxRecommendations,
  objectIDs: userObjectIDs,
  queryParameters: userQueryParameters,
  recommendClient,
  threshold,
  transformItems: userTransformItems = (x) => x,
}: UseRelatedProductsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');
  const objectIDs = useStableValue(userObjectIDs);
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

    const param = {
      fallbackParameters,
      indexName,
      maxRecommendations,
      objectIDs,
      queryParameters,
      threshold,
      transformItems: transformItemsRef.current,
    };

    if (hasProvider && isContextClient) {
      const key = JSON.stringify(param);
      const queries = objectIDs.map(
        (objectID: string): RecommendationsQuery => ({
          indexName,
          model: 'related-products',
          threshold,
          maxRecommendations,
          objectID,
          queryParameters,
          fallbackParameters,
        })
      );
      return register({
        key,
        getParameters() {
          return {
            queries,
            keyPair: {
              key,
              value: objectIDs.length,
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
    getRelatedProducts({
      ...param,
      recommendClient: client,
    }).then((response) => {
      setResult(response);
      setStatus('idle');
    });
    return () => {};
  }, [
    client,
    enabled,
    fallbackParameters,
    hasProvider,
    indexName,
    isContextClient,
    maxRecommendations,
    objectIDs,
    queryParameters,
    register,
    setStatus,
    threshold,
  ]);

  return {
    ...result,
    status,
  };
}
