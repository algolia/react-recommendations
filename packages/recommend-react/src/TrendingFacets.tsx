import { GetTrendingFacetsProps } from '@algolia/recommend-core';
import {
  createTrendingFacetsComponent,
  TrendingComponentProps as TrendingFacetsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { OptionalRecommendClient } from './types/OptionalRecommendClient';
import { useTrendingFacets } from './useTrendingFacets';

const UncontrolledTrendingFacets = createTrendingFacetsComponent({
  createElement,
  Fragment,
});

export type UseTrendingFacetsProps = OptionalRecommendClient<GetTrendingFacetsProps> & { enabled?: boolean };

export type TrendingFacetsProps = UseTrendingFacetsProps &
  Omit<
    TrendingFacetsVDOMProps,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function TrendingFacets(props: TrendingFacetsProps) {
  const { recommendations, status } = useTrendingFacets(props);

  return (
    <UncontrolledTrendingFacets
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
