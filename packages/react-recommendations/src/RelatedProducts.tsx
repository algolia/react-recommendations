import React, { useMemo } from 'react';

import { ListView } from './ListView';
import {
  ChildrenProps,
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
  const translations = useMemo<RecommendationTranslations>(
    () => ({
      title: 'Related products',
      sliderLabel: 'Related products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );

  const render = props.children ?? defaultRender;
  const ViewComponent = props.view ?? ListView;
  const View = (viewProps: unknown) => (
    <ViewComponent
      items={recommendations}
      itemComponent={props.itemComponent}
      translations={translations}
      {...viewProps}
    />
  );

  return render({ recommendations, translations, View });
}

function defaultRender<TObject>(props: ChildrenProps<TObject>) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return (
    <section className="auc-Recommendations">
      {props.translations.title && <h3>{props.translations.title}</h3>}

      <props.View />
    </section>
  );
}
