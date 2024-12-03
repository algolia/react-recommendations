import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { StrictMode } from 'react';

import { getItemName, getItemPrice } from '../../../../test/utils';
import { createMultiSearchResponse } from '../../../../test/utils/createApiResponse';
import {
  createRecommendClient,
  hit,
} from '../../../../test/utils/createRecommendClient';
import { useLookingSimilar } from '../useLookingSimilar';

function createMockedRecommendClient() {
  const recommendClient = createRecommendClient({
    getLookingSimilar: jest.fn(() =>
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

describe('useLookingSimilar', () => {
  test('gets Looking Similar', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, waitForNextUpdate } = renderHook(() =>
      useLookingSimilar({
        indexName: 'test',
        recommendClient,
        threshold: 0,
        objectIDs: ['testing'],
        queryParameters: {
          facetFilters: ['test'],
        },
        fallbackParameters: {
          facetFilters: ['test2'],
        },
      })
    );

    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        { ...hit, __indexName: 'test', __position: 1 },
      ]);
    });
  });

  test('assures that the transformItems function is applied properly after rerender', async () => {
    const { recommendClient } = createMockedRecommendClient();

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ transformItems, indexName }) =>
        useLookingSimilar({
          indexName,
          recommendClient,
          threshold: 0,
          objectIDs: ['testing'],
          queryParameters: {
            facetFilters: ['test'],
          },
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

    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([
        'Landoh 4-Pocket Jumpsuit',
      ]);
    });

    act(() => {
      rerender({ transformItems: getItemPrice, indexName: 'test1' });
    });

    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.recommendations).toEqual([250]);
    });
  });
});
