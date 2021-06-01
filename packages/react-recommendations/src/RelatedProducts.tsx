import React, { createElement, Fragment, useMemo } from 'react';

import { DefaultChildren } from './DefaultChildren';
import { DefaultFallback } from './DefaultFallback';
import { DefaultHeader } from './DefaultHeader';
import { ListView } from './ListView';
import {
  RecommendationsComponentProps,
  RecommendationTranslations,
} from './types';
import {
  useRelatedProducts,
  UseRelatedProductsProps,
} from './useRelatedProducts';

export type RelatedProductsProps<TObject> = UseRelatedProductsProps<TObject> &
  RecommendationsComponentProps<TObject>;

export function RelatedProducts<TObject>(props: RelatedProductsProps<TObject>) {
  const { recommendations } = useRelatedProducts<TObject>(props);
  const translations = useMemo<Required<RecommendationTranslations>>(
    () => ({
      title: 'Related products',
      sliderLabel: 'Related products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );
  const classNames = props.classNames ?? {};

  const children = props.children ?? DefaultChildren;
  const FallbackComponent = props.fallbackComponent ?? DefaultFallback;
  const HeaderComponent = props.headerComponent ?? DefaultHeader;
  const ViewComponent = props.view ?? ListView;

  const Fallback = () => (
    <FallbackComponent createElement={createElement} Fragment={Fragment} />
  );
  const Header = () => (
    <HeaderComponent
      classNames={classNames}
      createElement={createElement}
      Fragment={Fragment}
      recommendations={recommendations}
      translations={translations}
    />
  );
  const View = (viewProps: unknown) => (
    <ViewComponent
      classNames={classNames}
      createElement={createElement}
      Fragment={Fragment}
      itemComponent={props.itemComponent}
      items={recommendations}
      translations={translations}
      {...viewProps}
    />
  );

  return children({
    classNames,
    createElement,
    Fallback,
    Fragment,
    Header,
    recommendations,
    translations,
    View,
  });
}
