/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliarecommend from '@algolia/recommend';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from '@algolia/recommend-js';
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import algoliasearch from 'algoliasearch';
import { h, render } from 'preact';
import insights from 'search-insights';

import { RelatedItem } from './RelatedItem';
import { ProductHit, ReferenceItemProps } from './types';

import '@algolia/autocomplete-theme-classic';
import '@algolia/ui-components-horizontal-slider-theme';

const appId = 'XX85YRZZMV';
const apiKey = '098f71f9e2267178bdfc08cc986d2999';
const indexName = 'test_FLAGSHIP_ECOM_recommend';

const searchClient = algoliasearch(appId, apiKey);
const recommendClient = algoliarecommend(appId, apiKey);

insights('init', { appId, apiKey });
insights('setUserToken', 'user-token-1');

function updateReferenceItem(item: ProductHit) {
  render(
    <ReferenceItem item={item} />,
    document.querySelector('#referenceHit')
  );
  renderRecommendations(item);
}

autocomplete<ProductHit>({
  container: '#autocomplete',
  placeholder: 'Search for a product',
  openOnFocus: true,
  defaultActiveItemId: 0,
  getSources({ query }) {
    return [
      {
        sourceId: 'suggestions',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName,
                query,
                params: {
                  hitsPerPage: 5,
                },
              },
            ],
          });
        },
        getItemInputValue({ item }) {
          return item.name;
        },
        onSelect({ item }) {
          updateReferenceItem(item);
        },
        templates: {
          item({ item, components }) {
            return (
              <div className="aa-ItemWrapper">
                <div className="aa-ItemContent">
                  <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
                    <img
                      src={item.image_urls[0]}
                      alt={item.name}
                      width="40"
                      height="40"
                    />
                  </div>

                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                      <components.Highlight hit={item} attribute="name" />
                    </div>
                    <div className="aa-ItemContentDescription">
                      In <strong>{item.brand}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        },
      },
    ];
  },
});

function ReferenceItem({ item }: ReferenceItemProps) {
  return (
    <div className="my-2">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: '150px 1fr',
        }}
      >
        <div>
          <img
            src={item.image_urls[0]}
            alt={item.name}
            className="max-w-full"
          />
        </div>

        <div>
          <div className="text-sm text-gray-500">{item.brand}</div>

          <div className="text-gray-900 font-semibold mb-1 whitespace-normal">
            {item.name}
          </div>

          {Boolean(item.reviewScore) && (
            <div className="items-center flex flex-grow text-sm text-gray-700">
              <svg
                className="mr-1 text-orange-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="mr-1">
                {item.reviewScore.toFixed(1) || '--'}
              </span>
              <span className="text-gray-400">
                ({item.reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="my-2 font-semibold text-gray-800">${item.price}</div>
        </div>
      </div>
    </div>
  );
}

function renderRecommendations(selectedProduct: ProductHit) {
  frequentlyBoughtTogether<ProductHit>({
    container: '#frequentlyBoughtTogether',
    recommendClient,
    indexName,
    objectIDs: [selectedProduct.objectID],
    itemComponent({ item }) {
      return (
        <RelatedItem
          item={item}
          insights={insights}
          onSelect={updateReferenceItem}
        />
      );
    },
    maxRecommendations: 3,
    queryParameters: {
      analytics: true,
      clickAnalytics: true,
    },
    fallbackComponent() {
      return relatedProducts<ProductHit>({
        recommendClient,
        indexName,
        objectIDs: [selectedProduct.objectID],
        itemComponent({ item }) {
          return (
            <RelatedItem
              item={item}
              insights={insights}
              onSelect={updateReferenceItem}
            />
          );
        },
        view: horizontalSlider,
        maxRecommendations: 10,
        translations: {
          title: 'Related products (fallback)',
        },
        fallbackParameters: {
          facetFilters: [
            `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
          ],
        },
        queryParameters: {
          analytics: true,
          clickAnalytics: true,
          facetFilters: [
            `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
          ],
        },
      });
    },
  });

  relatedProducts<ProductHit>({
    container: '#relatedProducts',
    recommendClient,
    indexName,
    objectIDs: [selectedProduct.objectID],
    itemComponent({ item }) {
      return (
        <RelatedItem
          item={item}
          insights={insights}
          onSelect={updateReferenceItem}
        />
      );
    },
    view: horizontalSlider,
    maxRecommendations: 10,
    translations: {
      title: 'Related products',
    },
    fallbackParameters: {
      facetFilters: [
        `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
      ],
    },
    queryParameters: {
      analytics: true,
      clickAnalytics: true,
      facetFilters: [
        `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
      ],
    },
  });
}
