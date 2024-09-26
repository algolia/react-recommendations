import { TrendingFacetHit } from '@algolia/recommend';
import algoliasearch from 'algoliasearch';
import React from 'react';
import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import insights, { InsightsClient } from 'search-insights';

import { Autocomplete, getAlgoliaResults } from '../components/Autocomplete';
import { apiKey, appId, indexName } from '../config';
import { ProductHit } from '../types';

const searchClient = algoliasearch(appId, apiKey);

insights('init', { appId, apiKey });
insights('setUserToken', 'user-token-1');

export const Root: React.FC = () => {
  const navigate = useNavigate();

  const [
    selectedProduct,
    setSelectedProduct,
  ] = React.useState<ProductHit | null>(null);

  const [
    selectedFacetValue,
    setSelectedFacetValue,
  ] = React.useState<TrendingFacetHit | null>(null);

  return (
    <div className="container">
      <h1 className="title">
        <Link to="/">Algolia Recommend</Link>
      </h1>
      <Autocomplete
        placeholder="Search for a product"
        openOnFocus={true}
        defaultActiveItemId={0}
        getSources={({ query }) => {
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
                setSelectedProduct(item);
                navigate(`/product/${item.objectID}`);
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
        }}
      />
      <Outlet
        context={[
          {
            insights,
            selectedProduct,
            setSelectedProduct,
            selectedFacetValue,
            setSelectedFacetValue,
          },
        ]}
      />
    </div>
  );
};

type ApplicationContextType = Array<{
  insights: InsightsClient;
  selectedProduct: ProductHit | null;
  setSelectedProduct: (hit: ProductHit | null) => void;
  selectedFacetValue: TrendingFacetHit | null;
  setSelectedFacetValue: (facet: TrendingFacetHit | null) => void;
}>;

export function useApplicationContext() {
  return useOutletContext<ApplicationContextType>();
}
