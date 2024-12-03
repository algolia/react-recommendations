import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  lookingSimilar,
  relatedProducts,
  trendingFacets,
  trendingItems,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';

import { ProductHit } from '../types/ProductHit';

import { productItem } from './productItem';

import '@algolia/ui-components-horizontal-slider-theme';

const indexName = 'prod_ECOM';

const recommendClient = algoliarecommend(
  '93MWK2GLFE',
  '63a2f2cf276ced37f901d8612ce5b40c'
);

frequentlyBoughtTogether<ProductHit>({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Frequently bought together'),
  itemComponent: productItem,
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Related products'),
  itemComponent: productItem,
  view({ items, createElement, Fragment, itemComponent }) {
    return (
      horizontalSlider({
        items,
        itemComponent({ item }) {
          return itemComponent({ item, createElement, Fragment });
        },
      }) || createElement('div', null, 'Loading')
    );
  },
});

lookingSimilar<ProductHit>({
  container: '#lookingSimilar',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Looking similar'),
  itemComponent: productItem,
  view({ items, createElement, Fragment, itemComponent }) {
    return (
      horizontalSlider({
        items,
        itemComponent({ item }) {
          return itemComponent({ item, createElement, Fragment });
        },
      }) || createElement('div', null, 'Loading')
    );
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Trending items'),
  itemComponent: productItem,
  view({ items, itemComponent, Fragment, createElement }) {
    return (
      horizontalSlider({
        items,
        itemComponent({ item }) {
          return itemComponent({ item, createElement, Fragment });
        },
      }) || createElement('div', null, 'Loading')
    );
  },
});

trendingFacets({
  container: '#trendingFacets',
  recommendClient,
  indexName,
  facetName: 'brand',
  maxRecommendations: 5,
  headerComponent: ({ createElement }) =>
    createElement('h3', null, 'Trending facets'),
  itemComponent({ item, createElement }) {
    return createElement('p', null, item.facetValue);
  },
});
