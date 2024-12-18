import {
  createMultiSearchResponse,
  createRecommendClient,
  hit,
} from '../../../../test/utils';
import { getBatchRecommendations } from '../getBatchRecommendations';
import '@testing-library/jest-dom';

const recommendClient = createRecommendClient({
  getRecommendations: jest.fn(() =>
    Promise.resolve(
      createMultiSearchResponse({
        hits: [hit],
      })
    )
  ),
});

describe('getBatchRecommendations', () => {
  it('should call recommendClient', async () => {
    const result = await getBatchRecommendations({
      keys: [{ key: '{"key":"key-1"}', value: 1 }],
      queries: [
        {
          indexName: 'indexName',
          model: 'bought-together',
          objectID: 'objectID',
        },
      ],
      recommendClient,
    });

    expect(recommendClient.getRecommendations).toHaveBeenCalledTimes(1);
    expect(Object.keys(result)[0]).toEqual('{"key":"key-1"}');
    expect(Object.values(result)[0]).toEqual({
      recommendations: [{ ...hit, __indexName: 'indexName', __position: 1 }],
      trendingFacets: [],
    });
  });

  it('should transform items', async () => {
    const result = await getBatchRecommendations({
      keys: [{ key: '{"key":"key-1"}', value: 1 }],
      queries: [
        {
          indexName: 'indexName',
          model: 'bought-together',
          objectID: 'objectID',
          transformItems: (items) =>
            // @ts-expect-error
            items.map((item) => ({ ...item, name: 'QUERY_1_' + item.name })),
        },
      ],
      recommendClient,
    });

    // @ts-expect-error
    expect(result['{"key":"key-1"}'].recommendations[0].name).toEqual(
      'QUERY_1_Landoh 4-Pocket Jumpsuit'
    );
  });
});
