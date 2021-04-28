# @algolia/react-recommendations

This is the repository packaging the Algolia Recommend React component as well as an Algolia Recommend demo.

## Documentation

**During the beta of Algolia Recommend, this React component relies on an Algolia Index to retrieve the recommendations, and performs a regular Search API request to get the recommendations.**

Available props:

- `searchClient`: the Algolia API Client to use
- `model`: the name of the Recommendation model to use (`bought-together` or `related-product`)
- `indexName`: the name of the products index
- `objectID`: the objectID of the product to get recommendations from
- `hitComponent`: the InstantSearch-compatible `Hit` widget
- (optional) `hitsPerPage`: the number of recommendations to retrieve (default: max recommendations available)
- (optional) `facetFilters`: additional facet filters
- (optional) `fallbackFilters`: additional filters to use as fallback should there not be enough recommendations
- (optional) `analytics`: whether you want Search Analytics to be turned on or not (default: `false`)
- (optional) `clickAnalytics`: whether you want Click Analytics to be turned on or not (default: `false`)

```jsx
<Recommendations
  searchClient={searchClient}
  model={"related-products" | "bought-together"}
  indexName={"your_source_index_name"}
  objectID={currentObjectID}
  hitComponent={(props) => Hit(props)}
  hitsPerPage={5}
  facetFilters={[]}
  fallbackFilters={[]}
  analytics={true | false}
  clickAnalytics={true | false}
/>
```

## Development

To run this project locally, install the dependencies and run the local server:

```sh
yarn
yarn start
```

Open http://localhost:3000 to see your app.
