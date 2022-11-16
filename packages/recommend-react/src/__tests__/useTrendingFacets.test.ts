import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';

import { hit, initialState } from '../../../../test/utils/constants';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import { createRecommendClient } from '../../../../test/utils/createRecommendClient';
import { useTrendingFacets } from '../useTrendingFacets';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getTrendingFacets: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse({
          hits: [hit],
        })
      )
    ),
  });

  return {
    recommendClient,
  };
}

describe('useTrendingFacets', () => {
  test('gets trending facets', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(() =>
      useTrendingFacets({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        queryParameters: {
          facetFilters: ['test'],
        },
        fallbackParameters: {
          facetFilters: ['test2'],
        },
        facetName: 'test4',
      })
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([hit]);
    });
  });

  test('assures that the transformItems function is applied properly after rerender', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, rerender } = renderHook(
      ({ transformItems, indexName }) =>
        useTrendingFacets({
          indexName,
          recommendClient,
          threshold: 0,
          queryParameters: {
            facetFilters: ['test'],
          },
          fallbackParameters: {
            facetFilters: ['test2'],
          },
          facetName: 'test4',
          transformItems,
        }),
      {
        wrapper: StrictMode,
        initialProps: {
          transformItems: getItemName,
          indexName: 'test',
        },
      }
    );
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        'Landoh 4-Pocket Jumpsuit',
      ]);
    });

    act(() => {
      rerender({ transformItems: getItemPrice, indexName: 'test1' });
    });

    await waitFor(() => {
      expect(result.current.recommendations).toEqual([250]);
    });
  });

  test('gets trendingFacets from initialState', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result } = renderHook(
      () =>
        useTrendingFacets({
          indexName: 'test',
          recommendClient,
          threshold: 0,
          queryParameters: {
            facetFilters: ['test'],
          },
          fallbackParameters: {
            facetFilters: ['test2'],
          },
          facetName: 'test4',
          transformItems: (items) => items,
          initialState,
        }),
      {
        wrapper: StrictMode,
      }
    );

    await waitFor(() => {
      expect(result.current.recommendations).toEqual(
        initialState.recommendations
      );
      expect(result.current.status).toBe('idle');
    });
  });

  test("doesn't initially fetch the recommendations with initialState", () => {
    const { recommendClient } = createMockedRecommendClient();

    renderHook(
      () =>
        useTrendingFacets({
          indexName: 'test',
          recommendClient,
          threshold: 0,
          queryParameters: {
            facetFilters: ['test'],
          },
          fallbackParameters: {
            facetFilters: ['test2'],
          },
          facetName: 'test4',
          transformItems: (items) => items,
          initialState,
        }),
      {
        wrapper: StrictMode,
      }
    );

    expect(recommendClient.getTrendingFacets).toHaveBeenCalledTimes(0);
  });

  test('fetches recommendations when props change with initialState', () => {
    const { recommendClient } = createMockedRecommendClient();

    const { rerender } = renderHook(
      ({ indexName }) =>
        useTrendingFacets({
          indexName,
          recommendClient,
          threshold: 0,
          queryParameters: {
            facetFilters: ['test'],
          },
          fallbackParameters: {
            facetFilters: ['test2'],
          },
          facetName: 'test4',
          transformItems: (items) => items,
          initialState,
        }),
      {
        wrapper: StrictMode,
        initialProps: { indexName: 'test' },
      }
    );
    expect(recommendClient.getTrendingFacets).toHaveBeenCalledTimes(0);
    expect(recommendClient.getTrendingFacets).toHaveBeenCalledWith({indexName: 'test'});

    act(() => {
      rerender({ indexName: 'test1' });
    });

    expect(recommendClient.getTrendingFacets).toHaveBeenCalledTimes(1);
    expect(recommendClient.getTrendingFacets).toHaveBeenCalledWith({indexName: 'test1'});
  });
});
