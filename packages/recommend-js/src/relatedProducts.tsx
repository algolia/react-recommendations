/** @jsx h */
import {
  GetRecommendationsResult,
  getRelatedProducts,
  GetRelatedProductsProps,
} from '@algolia/recommend-core';
import {
  createRelatedProductsComponent,
  RelatedProductsProps as RelatedProductsVDOMProps,
} from '@algolia/recommend-vdom';
import { html } from 'htm/preact';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, HTMLTemplate } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';
import { withHtml } from './utils';

const UncontrolledRelatedProducts = createRelatedProductsComponent({
  createElement,
  Fragment,
});

function useRelatedProducts<TObject>(props: GetRelatedProductsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getRelatedProducts(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

type RelatedProductsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetRelatedProductsProps<TObject> &
  Omit<RelatedProductsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

function RelatedProducts<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: RelatedProductsProps<TObject, TComponentProps>) {
  const { recommendations, status } = useRelatedProducts<TObject>(props);

  return (
    <UncontrolledRelatedProducts
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function relatedProducts<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  children,
  ...props
}: RelatedProductsProps<TObject, HTMLTemplate> & EnvironmentProps) {
  const vnode = (
    <RelatedProducts<TObject, HTMLTemplate>
      {...props}
      view={view && withHtml(view)}
      itemComponent={itemComponent && withHtml(itemComponent)}
      headerComponent={headerComponent && withHtml(headerComponent)}
      fallbackComponent={fallbackComponent && withHtml(fallbackComponent)}
    >
      {children
        ? (childrenProps) => children({ ...childrenProps, html })
        : undefined}
    </RelatedProducts>
  );

  if (!container) {
    return vnode;
  }

  render(vnode, getHTMLElement(container, environment));

  return null;
}
