import type { SearchOptions } from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch';
import { useMemo, useEffect, useState } from 'react';

import {
  UseRecommendationsInternalProps,
  ProductBaseRecord,
  RecommendationModel,
  RecommendationTransformItems,
} from './types';
import {
  getHitsPerPage,
  getIndexNameFromModel,
  getOptionalFilters,
} from './utils';

export type UseRecommendationsProps<TObject> = {
  model: RecommendationModel;
  indexName: string;
  objectID: string;
  searchClient: SearchClient;

  fallbackFilters?: SearchOptions['optionalFilters'];
  maxRecommendations?: number;
  searchParameters?: SearchOptions;
  threshold?: number;
  transformItems?: RecommendationTransformItems<TObject>;
};

type UseRecommendationReturn<TObject> = {
  recommendations: TObject[];
};

function getDefaultedProps<TObject extends ProductBaseRecord>(
  props: UseRecommendationsProps<TObject>
): UseRecommendationsInternalProps<TObject> {
  return {
    fallbackFilters: [],
    maxRecommendations: 0,
    searchParameters: {
      analytics: false,
      analyticsTags: [`alg-recommend_${props.model}`],
      clickAnalytics: false,
      enableABTest: false,
      filters: `NOT objectID:${props.objectID}`,
      ruleContexts: [`alg-recommend_${props.model}_${props.objectID}`],
      typoTolerance: false,
      ...props.searchParameters,
    },
    threshold: 0,
    transformItems: (items) => items,
    ...props,
  };
}

export function useRecommendations<TObject extends ProductBaseRecord>(
  userProps: UseRecommendationsProps<TObject>
): UseRecommendationReturn<TObject> {
  const [products, setProducts] = useState<TObject[]>([]);
  const props = useMemo(() => getDefaultedProps(userProps), [userProps]);

  useEffect(() => {
    props.searchClient
      .initIndex(getIndexNameFromModel(props.model, props.indexName))
      .getObject<TObject>(props.objectID)
      .then((record) => {
        const recommendations = record.recommendations ?? [];

        props.searchClient
          .initIndex(props.indexName)
          .search<TObject>('', {
            hitsPerPage: getHitsPerPage({
              fallbackFilters: props.fallbackFilters,
              maxRecommendations: props.maxRecommendations,
              recommendations,
            }),
            ...props.searchParameters,
            optionalFilters: getOptionalFilters({
              fallbackFilters: props.fallbackFilters,
              recommendations,
              threshold: props.threshold,
            }).concat(props.searchParameters.optionalFilters as any),
          })
          .then((result) => {
            const hits = result.hits.map((hit, index) => {
              const match = recommendations.find(
                (x) => x.objectID === hit.objectID
              );

              return {
                ...hit,
                __indexName: props.indexName,
                __queryID: result.queryID,
                __position: index + 1,
                // @TODO: this is for debugging purpose and can be removed
                // before stable release.
                __recommendScore: match?.score,
              };
            });

            setProducts(props.transformItems(hits));
          });
      })
      .catch(() => {
        // The `objectID` doesn't exist, we cannot get recommendations.
        setProducts([]);
      });
  }, [props]);

  return {
    recommendations: products,
  };
}
