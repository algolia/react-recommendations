/** @jsx h */
import {
  getTrendingItems,
  GetTrendingItemsProps,
  GetRecommendationsResult,
} from '@algolia/recommend-core';
import {
  createTrendingItemsComponent,
  TrendingItemsProps as TrendingItemsVDOMProps,
} from '@algolia/recommend-vdom';
import { createElement, Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getHTMLElement } from './getHTMLElement';
import { EnvironmentProps, Template, html } from './types';
import { useAlgoliaAgent } from './useAlgoliaAgent';
import { useStatus } from './useStatus';

const UncontrolledTrendingItems = createTrendingItemsComponent({
  createElement,
  Fragment,
});

function useTrendingItems<TObject>(props: GetTrendingItemsProps<TObject>) {
  const [result, setResult] = useState<GetRecommendationsResult<TObject>>({
    recommendations: [],
  });
  const { status, setStatus } = useStatus('loading');

  useAlgoliaAgent({ recommendClient: props.recommendClient });

  useEffect(() => {
    setStatus('loading');
    getTrendingItems(props).then((response) => {
      setResult(response);
      setStatus('idle');
    });
  }, [props, setStatus]);

  return {
    ...result,
    status,
  };
}

type TrendingItemsProps<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
> = GetTrendingItemsProps<TObject> &
  Omit<TrendingItemsVDOMProps<TObject, TComponentProps>, 'items' | 'status'>;

function TrendingItems<
  TObject,
  TComponentProps extends Record<string, unknown> = {}
>(props: TrendingItemsProps<TObject, TComponentProps>) {
  const { recommendations, status } = useTrendingItems<TObject>(props);
  return (
    <UncontrolledTrendingItems
      {...props}
      items={recommendations}
      status={status}
    />
  );
}

export function trendingItems<TObject>({
  container,
  environment = window,
  itemComponent,
  fallbackComponent,
  headerComponent,
  view,
  ...props
}: TrendingItemsProps<TObject, Template> & EnvironmentProps) {
  const children = (
    <TrendingItems<TObject, Template>
      {...props}
      view={view ? (viewProps) => view({ ...viewProps, html }) : undefined}
      itemComponent={(itemComponentProps) =>
        itemComponent({
          ...itemComponentProps,
          html,
        })
      }
      headerComponent={(headerComponentProps) =>
        headerComponent
          ? headerComponent({ ...headerComponentProps, html })
          : null
      }
      fallbackComponent={(fallbackComponentProps) =>
        fallbackComponent
          ? fallbackComponent({
              ...fallbackComponentProps,
              html,
            })
          : null
      }
    />
  );

  if (!container) {
    return children;
  }

  render(children, getHTMLElement(container, environment));

  return undefined;
}
