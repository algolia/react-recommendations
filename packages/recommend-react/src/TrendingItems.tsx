import { GetTrendingItemsProps } from '@algolia/recommend-core';
import {
  createTrendingItemsComponent,
  TrendingItemsProps as TrendingItemsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { OptionalRecommendClient } from './types/OptionalRecommendClient';
import { useTrendingItems } from './useTrendingItems';

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

export type UseTrendingItemsProps<TObject> = OptionalRecommendClient<
  GetTrendingItemsProps<TObject>
> & { enabled?: boolean };

export type TrendingItemsProps<TObject> = UseTrendingItemsProps<TObject> &
  Omit<
    TrendingItemsVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function TrendingItems<TObject>(props: TrendingItemsProps<TObject>) {
  const { recommendations, status } = useTrendingItems<TObject>(props);

  return (
    <UncontrolledTrendingItems
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
