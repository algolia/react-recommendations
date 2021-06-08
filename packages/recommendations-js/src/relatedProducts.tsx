/** @jsx h */
import {
  GetRecommendationsResult,
  getRelatedProducts,
  GetRelatedProductsProps,
} from '@algolia/recommendations-core';
import {
  createRelatedProductsComponent,
  RelatedProductsProps,
} from '@algolia/recommendations-vdom';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

function useRelatedProducts<TObject>(props: GetRelatedProductsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });

  useAlgoliaAgent({ searchClient: props.searchClient });

  useEffect(() => {
    getRelatedProducts(props).then((response) => {
      setResult(response);
    });
  }, [props]);

  return result;
}

function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations } = useRelatedProducts<TObject>(props);

  return <UncontrolledRelatedProducts {...props} items={recommendations} />;
}

export function relatedProducts<TObject>({
  container,
  environment = window,
  ...props
}: RelatedProductsProps<TObject> & EnvironmentProps) {
  render(
    <RelatedProducts {...props} />,
    getHTMLElement(container, environment)
  );
}
