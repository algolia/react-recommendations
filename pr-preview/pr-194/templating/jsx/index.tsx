/** @jsxRuntime classic */
/** @jsx h */
import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  lookingSimilar,
  relatedProducts,
  trendingFacets,
  trendingItems,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import { h } from 'preact';

import { ProductHit } from '../types/ProductHit';

import { ProductItem } from './ProductItem';

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
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  view: (...props) => horizontalSlider(...props) || <div>Loading</div>,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

lookingSimilar<ProductHit>({
  container: '#lookingSimilar',
  recommendClient,
  indexName,
  view: (...props) => horizontalSlider(...props) || <div>Loading</div>,
  objectIDs: ['M0E20000000EAAK'],
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  view: (...props) => horizontalSlider(...props) || <div>Loading</div>,
  itemComponent({ item }) {
    return <ProductItem item={item} />;
  },
});

trendingFacets({
  container: '#trendingFacets',
  recommendClient,
  indexName,
  facetName: 'brand',
  maxRecommendations: 5,
  itemComponent({ item }) {
    return <p>{item.facetValue}</p>;
  },
});
