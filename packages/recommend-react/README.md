> 🙌 From now on you can use Algolia Recommend from InstantSearch, simplifying your integration between the two libraries!
>
> Learn how to migrate following the [upgrade guide](https://www.algolia.com/doc/guides/algolia-recommend/upgrade/recommend-react/).

```jsx
import {
  InstantSearch,
  FrequentlyBoughtTogether,
  RelatedProducts,
} from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey');

function App() {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <FrequentlyBoughtTogether objectIDs={[currentObjectID]} />
      <RelatedProducts objectIDs={[currentObjectID]} />
    </InstantSearch>
  );
}
```

---
---
---

# `@algolia/recommend-react`

React package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/).

## Installation

All Recommend packages are available on the [npm](https://www.npmjs.com/) registry.

```bash
yarn add @algolia/recommend-react
# or
npm install @algolia/recommend-react
```

## Usage

Import the [`FrequentlyBoughtTogether`](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-react/FrequentlyBoughtTogether/) and [`RelatedProducts`](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-react/RelatedProducts/) and use them in your parent component.

```JSX
import React from 'react';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
} from '@algolia/recommend-react';
import recommend from '@algolia/recommend';

const recommendClient = recommend('YourApplicationID', 'YourSearchOnlyAPIKey');
const indexName = 'YOUR_INDEX_NAME';

function App({ currentObjectID }) {
  // ...

  return (
    <div>
      <FrequentlyBoughtTogether
        recommendClient={recommendClient}
        indexName={indexName}
        objectIDs={[currentObjectID]}
        itemComponent={({ item }) => {
          return (
            <pre>
              <code>{JSON.stringify(item)}</code>
            </pre>
          );
        }}
      />
      <RelatedProducts
        recommendClient={recommendClient}
        indexName={indexName}
        objectIDs={[currentObjectID]}
        itemComponent={({ item }) => {
          return (
            <pre>
              <code>{JSON.stringify(item)}</code>
            </pre>
          );
        }}
      />
    </div>
  );
}
```

Continue reading our [**Getting Started**](https://www.algolia.com/doc/ui-libraries/recommend/introduction/getting-started/?client=React) guide.

## Documentation

The [documentation](https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/) offers a few ways to learn about the Recommend library:

- Follow the [**Building your Recommend UI guide**](https://www.algolia.com/doc/guides/algolia-ai/recommend/?client=react#building-your-recommendation-ui) to display recommendations on your website.
- Refer to the [**API reference**](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-react/) for a comprehensive list of parameters and options.
