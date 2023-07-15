import { GetRelatedProductsProps } from '@algolia/recommend-core';
import {
  createRelatedProductsComponent,
  RelatedProductsProps as RelatedProductsVDOMProps,
} from '@algolia/recommend-vdom';
import React, { createElement, Fragment } from 'react';

import { OptionalRecommendClient } from './types/OptionalRecommendClient';
import { useRelatedProducts } from './useRelatedProducts';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

export type UseRelatedProductsProps<TObject> = OptionalRecommendClient<
  GetRelatedProductsProps<TObject>
> & { enabled?: boolean };

export type RelatedProductsProps<TObject> = UseRelatedProductsProps<TObject> &
  Omit<
    RelatedProductsVDOMProps<TObject>,
    'items' | 'status' | 'createElement' | 'Fragment'
  >;

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations, status } = useRelatedProducts<TObject>(props);

  return (
    <UncontrolledRelatedProducts
      {...props}
      items={recommendations}
      status={status}
    />
  );
}
