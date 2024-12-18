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
  headerComponent: ({ html }) => html`<h3>Frequently bought together</h3>`,
  itemComponent: productItem,
});

relatedProducts<ProductHit>({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ html }) => html`<h3>Related products</h3>`,
  itemComponent: productItem,
  view({ items, itemComponent, ...renderer }) {
    return (
      horizontalSlider({
        items,
        itemComponent({ item }) {
          return itemComponent({ item, ...renderer });
        },
      }) || renderer.html`<div>Loading</div>`
    );
  },
});

lookingSimilar<ProductHit>({
  container: '#lookingSimilar',
  recommendClient,
  indexName,
  objectIDs: ['M0E20000000EAAK'],
  headerComponent: ({ html }) => html`<h3>Looking similar</h3>`,
  itemComponent: productItem,
  view({ items, itemComponent, ...renderer }) {
    return (
      horizontalSlider({
        items,
        itemComponent({ item }) {
          return itemComponent({ item, ...renderer });
        },
      }) || renderer.html`<div>Loading</div>`
    );
  },
});

trendingItems<ProductHit>({
  container: '#trendingItems',
  recommendClient,
  indexName,
  headerComponent: ({ html }) => html`<h3>Trending items</h3>`,
  itemComponent: productItem,
  view({ items, itemComponent, ...renderer }) {
    return (
      horizontalSlider({
        items,
        itemComponent({ item }) {
          return itemComponent({ item, ...renderer });
        },
      }) || renderer.html`<div>Loading</div>`
    );
  },
});

trendingFacets({
  container: '#trendingFacets',
  recommendClient,
  indexName,
  facetName: 'brand',
  maxRecommendations: 5,
  headerComponent: ({ html }) => html`<h3>Trending facets</h3>`,
  itemComponent({ item, html }) {
    return html`<p>${item.facetValue}</p>`;
  },
});
