import { mapByScoreToRecommendations } from '../mapByScoreToRecommendations';
import { uniqBy } from '../uniqBy';

const response = {
  results: [
    {
      exhaustiveNbHits: true,
      hits: [
        {
          objectID: '1-1',
          name: 'Product 1-1',
          _score: 100,
        },
        {
          objectID: '1-2',
          name: 'Product 1-2',
          _score: 90,
        },
        {
          objectID: '1-3',
          name: 'Product 1-3',
          _score: 70,
        },
        {
          objectID: '1-4',
          name: 'Product 1-4',
        },
        {
          objectID: '1-5',
          name: 'Product 1-5',
        },
      ],
      hitsPerPage: 10,
      nbHits: 10,
      nbPages: 1,
      page: 0,
      processingTimeMS: 1,
    },
    {
      exhaustiveNbHits: true,
      hits: [
        {
          objectID: '2-1',
          name: 'Product 2-1',
          _score: 100,
        },
        {
          objectID: '2-2',
          name: 'Product 2-2',
          _score: 90,
        },
        {
          objectID: '2-3',
          name: 'Product 2-3',
          _score: 70,
        },
        {
          objectID: '2-4',
          name: 'Product 2-4',
        },
        {
          objectID: '2-5',
          name: 'Product 2-5',
        },
      ],
      hitsPerPage: 10,
      nbHits: 10,
      nbPages: 1,
      page: 0,
      processingTimeMS: 1,
    },
  ],
};

describe('mapByScoreToRecommendations', () => {
  test('sorts the items based on their scores', () => {
    const result = mapByScoreToRecommendations({
      hits: uniqBy<any>(
        'objectID',
        response.results.map((result) => result.hits).flat()
      ),
      indexName: 'index-name',
      queryID: 'some-random-query-id',
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "__indexName": "index-name",
          "__position": 1,
          "__queryID": "some-random-query-id",
          "_score": 100,
          "name": "Product 1-1",
          "objectID": "1-1",
        },
        Object {
          "__indexName": "index-name",
          "__position": 2,
          "__queryID": "some-random-query-id",
          "_score": 100,
          "name": "Product 2-1",
          "objectID": "2-1",
        },
        Object {
          "__indexName": "index-name",
          "__position": 3,
          "__queryID": "some-random-query-id",
          "_score": 90,
          "name": "Product 1-2",
          "objectID": "1-2",
        },
        Object {
          "__indexName": "index-name",
          "__position": 4,
          "__queryID": "some-random-query-id",
          "_score": 90,
          "name": "Product 2-2",
          "objectID": "2-2",
        },
        Object {
          "__indexName": "index-name",
          "__position": 5,
          "__queryID": "some-random-query-id",
          "_score": 70,
          "name": "Product 1-3",
          "objectID": "1-3",
        },
        Object {
          "__indexName": "index-name",
          "__position": 6,
          "__queryID": "some-random-query-id",
          "_score": 70,
          "name": "Product 2-3",
          "objectID": "2-3",
        },
        Object {
          "__indexName": "index-name",
          "__position": 7,
          "__queryID": "some-random-query-id",
          "name": "Product 1-4",
          "objectID": "1-4",
        },
        Object {
          "__indexName": "index-name",
          "__position": 8,
          "__queryID": "some-random-query-id",
          "name": "Product 1-5",
          "objectID": "1-5",
        },
        Object {
          "__indexName": "index-name",
          "__position": 9,
          "__queryID": "some-random-query-id",
          "name": "Product 2-4",
          "objectID": "2-4",
        },
        Object {
          "__indexName": "index-name",
          "__position": 10,
          "__queryID": "some-random-query-id",
          "name": "Product 2-5",
          "objectID": "2-5",
        },
      ]
    `);
  });
});
