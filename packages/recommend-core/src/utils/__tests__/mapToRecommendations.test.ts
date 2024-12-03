import { mapToRecommendations } from '../mapToRecommendations';

const response = {
  results: [
    {
      exhaustiveNbHits: true,
      hits: [
        {
          objectID: 'A',
          name: 'Product A',
          _score: 100,
        },
        {
          objectID: 'B',
          name: 'Product B',
          _score: 0,
        },
        {
          objectID: 'C',
          name: 'Product C',
          _score: 0,
        },
        {
          objectID: 'D',
          name: 'Product D',
          _score: 89,
        },
        {
          objectID: 'E',
          name: 'Product E',
          _score: 76,
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
          objectID: 'F',
          name: 'Product F',
          _score: 100,
        },
        {
          objectID: 'B',
          name: 'Product B',
          _score: 0,
        },
        {
          objectID: 'E',
          name: 'Product E',
          _score: 0,
        },
        {
          objectID: 'G',
          name: 'Product G',
          _score: 96,
        },
        {
          objectID: 'C',
          name: 'Product C',
          _score: 0,
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

describe('mapToRecommendations', () => {
  test('sorts the items based on their average index thus preserving applied rules', () => {
    const result = mapToRecommendations({
      hits: response.results.map((result) => result.hits),
      nrOfObjs: 2,
      queryIDs: ['queryID1'],
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "__queryID": "queryID1",
          "_score": 0,
          "name": "Product B",
          "objectID": "B",
        },
        Object {
          "__queryID": "queryID1",
          "_score": 76,
          "name": "Product E",
          "objectID": "E",
        },
        Object {
          "__queryID": "queryID1",
          "_score": 0,
          "name": "Product C",
          "objectID": "C",
        },
        Object {
          "_score": 100,
          "name": "Product F",
          "objectID": "F",
        },
        Object {
          "__queryID": "queryID1",
          "_score": 100,
          "name": "Product A",
          "objectID": "A",
        },
        Object {
          "_score": 96,
          "name": "Product G",
          "objectID": "G",
        },
        Object {
          "__queryID": "queryID1",
          "_score": 89,
          "name": "Product D",
          "objectID": "D",
        },
      ]
    `);
  });
});
