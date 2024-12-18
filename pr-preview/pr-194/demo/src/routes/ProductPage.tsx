import algoliarecommend from '@algolia/recommend';
import {
  FrequentlyBoughtTogether,
  Recommend,
  RelatedProducts,
  LookingSimilar,
} from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import algoliasearch from 'algoliasearch';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Hit,
  BundleItem,
  BundleView,
  ComparisonChartView,
} from '../components';
import { ComparisonChartItem } from '../components/ComparisonChartItem';
import { apiKey, appId, indexName } from '../config';
import { ProductHit } from '../types';

import { useApplicationContext } from './Root';

const searchClient = algoliasearch(appId, apiKey);
const index = searchClient.initIndex(indexName);
const recommendClient = algoliarecommend(appId, apiKey);

export const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [
    { insights, selectedProduct, setSelectedProduct, selectedFacetValue },
  ] = useApplicationContext();

  useEffect(() => {
    if (!selectedProduct && id !== undefined) {
      index.getObject<ProductHit>(id).then((product) => {
        setSelectedProduct(product);
      });
    } else if (!selectedProduct && id === undefined) {
      navigate('/');
    }
  }, [id, navigate, selectedProduct, setSelectedProduct]);

  if (!selectedProduct) {
    return <div>Loading</div>;
  }

  return (
    <Recommend recommendClient={recommendClient}>
      <div style={{ padding: '1rem 0' }}>
        <div
          className="Hit"
          style={{ gridTemplateColumns: '150px 1fr', gap: '1rem' }}
        >
          <div className="Hit-Image" style={{ maxWidth: 150 }}>
            <img
              src={selectedProduct.image_urls[0]}
              alt={selectedProduct.name}
            />
          </div>

          <div className="Hit-Content">
            <div className="Hit-Name">{selectedProduct.name}</div>
            <div className="Hit-Description">{selectedProduct.objectID}</div>
            <footer className="Hit-Footer">
              <span className="Hit-Price">${selectedProduct.price.value}</span>
            </footer>
          </div>
        </div>
      </div>
      <LookingSimilar<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        itemComponent={({ item }) => (
          <Hit hit={item} insights={insights} onSelect={setSelectedProduct} />
        )}
        maxRecommendations={10}
        threshold={75}
        view={HorizontalSlider}
        queryParameters={{
          analytics: true,
          clickAnalytics: true,
        }}
      />
      <FrequentlyBoughtTogether<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        itemComponent={({ item }) => (
          <BundleItem
            item={item}
            onSelect={setSelectedProduct}
            insights={insights}
          />
        )}
        maxRecommendations={2}
        queryParameters={{
          analytics: true,
          clickAnalytics: true,
          facetFilters: selectedFacetValue
            ? [`brand:${selectedFacetValue}`]
            : [],
        }}
        view={({ itemComponent, items }) => (
          <BundleView
            currentItem={selectedProduct}
            itemComponent={itemComponent}
            items={items}
          />
        )}
        fallbackComponent={() => (
          <RelatedProducts<ProductHit>
            indexName={indexName}
            objectIDs={[selectedProduct.objectID]}
            itemComponent={({ item }) => (
              <Hit
                hit={item}
                insights={insights}
                onSelect={setSelectedProduct}
              />
            )}
            view={HorizontalSlider}
            maxRecommendations={10}
            translations={{
              title: 'Related products (fallback)',
            }}
            fallbackParameters={{
              facetFilters: [
                `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
              ],
            }}
            queryParameters={{
              analytics: true,
              clickAnalytics: true,
              facetFilters: [
                `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
              ],
            }}
          />
        )}
      />
      <RelatedProducts<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        itemComponent={({ item }) => (
          <Hit hit={item} insights={insights} onSelect={setSelectedProduct} />
        )}
        maxRecommendations={10}
        view={HorizontalSlider}
        translations={{
          title: 'Related products',
        }}
        fallbackParameters={{
          facetFilters: [
            `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
          ],
        }}
        queryParameters={{
          analytics: true,
          clickAnalytics: true,
          facetFilters: [
            `hierarchical_categories.lvl0:${selectedProduct.hierarchical_categories.lvl0}`,
            selectedFacetValue ? `brand:${selectedFacetValue}` : '',
          ],
        }}
      />
      <RelatedProducts<ProductHit>
        indexName={indexName}
        objectIDs={[selectedProduct.objectID]}
        itemComponent={({ item }) => (
          <ComparisonChartItem
            item={item}
            insights={insights}
            onSelect={setSelectedProduct}
          />
        )}
        maxRecommendations={3}
        view={({ itemComponent, items }) => (
          <ComparisonChartView
            currentItem={selectedProduct}
            itemComponent={itemComponent}
            items={items}
          />
        )}
        translations={{
          title: 'Comparison Chart',
        }}
        fallbackParameters={{
          facetFilters: [
            `hierarchical_categories.lvl2:${selectedProduct.hierarchical_categories.lvl2}`,
          ],
        }}
      />
    </Recommend>
  );
};
