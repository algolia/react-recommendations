import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getRecommendations } from '../getRecommendations';
import { RecommendModel } from '../types';

describe('getRecommendations', () => {
  test('does not forward unwanted props', async () => {
    const recommendClient = createRecommendClient({
      getRecommendations: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    await getRecommendations({
      model: 'related-products' as RecommendModel,
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      // @ts-expect-error unwanted props
      a: 'b',
    });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendations).toHaveBeenCalledWith([
      {
        model: 'related-products',
        indexName: 'indexName',
        objectID: 'objectID',
      },
    ]);
  });

  test('calls the correct index for "related-products"', async () => {
    const recommendClient = createRecommendClient({
      getRecommendations: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    await getRecommendations({
      model: 'related-products' as RecommendModel,
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      queryParameters: {
        facetFilters: [['brand:Apple']],
        optionalFilters: ['category:Laptops'],
      },
    });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendations).toHaveBeenCalledWith([
      {
        model: 'related-products',
        indexName: 'indexName',
        objectID: 'objectID',
        queryParameters: {
          facetFilters: [['brand:Apple']],
          optionalFilters: ['category:Laptops'],
        },
      },
    ]);
  });

  test('calls the correct index for "bought-together"', async () => {
    const recommendClient = createRecommendClient({
      getRecommendations: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [hit],
          })
        )
      ),
    });

    await getRecommendations({
      model: 'bought-together' as RecommendModel,
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
      queryParameters: {
        facetFilters: [['brand:Apple']],
        optionalFilters: ['category:Laptops'],
      },
    });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(recommendClient.getRecommendations).toHaveBeenCalledWith([
      {
        model: 'bought-together',
        indexName: 'indexName',
        objectID: 'objectID',
        queryParameters: {
          facetFilters: [['brand:Apple']],
          optionalFilters: ['category:Laptops'],
        },
      },
    ]);
  });

  test('returns recommended hits', async () => {
    const recommendClient = createRecommendClient({
      getRecommendations: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse({
            hits: [{ ...hit, __indexName: 'indexName', __position: 1 }],
          })
        )
      ),
    });

    const { recommendations } = await getRecommendations({
      model: 'related-products' as RecommendModel,
      recommendClient,
      indexName: 'indexName',
      objectIDs: ['objectID'],
    });

    expect(recommendations).toEqual([
      {
        __indexName: 'indexName',
        __position: 1,
        category: 'Women - Jumpsuits-Overalls',
        hierarchical_categories: {
          lvl0: 'women',
          lvl1: 'women > jeans & bottoms',
          lvl2: 'women > jeans & bottoms > jumpsuits & overalls',
        },
        keywords: [
          'women',
          'jeans & bottoms',
          'jumpsuits & overalls',
          'Jumpsuits',
          'Loose',
          'Woven',
          'Long sleeve',
          'Grey',
        ],
        name: 'Landoh 4-Pocket Jumpsuit',
        objectID: 'D06270-9132-995',
        price: 250,
        recommendations: [
          {
            objectID: '1',
            score: 1.99,
          },
          {
            objectID: '2',
            score: 2.99,
          },
          {
            objectID: '3',
            score: 3.99,
          },
        ],
        url: 'women/jumpsuits-overalls/d06270-9132-995',
      },
    ]);
  });
});
