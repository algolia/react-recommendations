> 🙌 From now on you can use Algolia Recommend from InstantSearch, simplifying your integration between the two libraries!
>
> Learn how to migrate following the [upgrade guide for JS](https://www.algolia.com/doc/guides/algolia-recommend/upgrade/recommend-js/) or [for React](https://www.algolia.com/doc/guides/algolia-recommend/upgrade/recommend-react/).


```js
import instantsearch from 'instantsearch.js';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from 'instantsearch.js/es/widgets';
import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey');

instantsearch({
  // No need for a recommendClient anymore
  searchClient,
  indexName,
}).addWidgets([
  frequentlyBoughtTogether({
    container: '#frequentlyBoughtTogether',
    objectIDs: [currentObjectID],
  }),
  relatedProducts({
    container: '#relatedProducts',
    objectIDs: [currentObjectID],
  }),
]);
```

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

# Recommend

[![Version](https://img.shields.io/npm/v/@algolia/recommend-js.svg?style=flat-square)](https://www.npmjs.com/package/@algolia/recommend-js) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Recommend is the repository packaging the UI components for Algolia Recommend, available for Vanilla JavaScript and React.

## Installation

All Recommend packages are available on the [npm](https://www.npmjs.com/) registry.

### For [JavaScript](/packages/recommend-js)

```bash
yarn add @algolia/recommend-js
# or
npm install @algolia/recommend-js
```

### For [React](/packages/recommend-react)

```bash
yarn add @algolia/recommend-react
# or
npm install @algolia/recommend-react
```

## Usage

### For [JavaScript](/packages/recommend-js)

To get started, you need a container for your recommendations to go in—in this guide, one for Frequently Bought Together, and one for Related Products. If you don't have containers already, you can insert them into your markup:

```html
<div id="frequentlyBoughtTogether"></div>
<div id="relatedProducts"></div>
```

Then, insert your recommendations by calling the [`frequentlyBoughtTogether`](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/frequentlyBoughtTogether/) function and providing the [`container`](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/frequentlyBoughtTogether/#param-container). It can be a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement).

The process is the same for [`relatedProducts`](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/relatedProducts/).

```jsx
/** @jsx h */
import { h } from 'preact';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from '@algolia/recommend-js';
import recommend from '@algolia/recommend';

const recommendClient = recommend('YourApplicationID', 'YourSearchOnlyAPIKey');
const indexName = 'YOUR_INDEX_NAME';
const currentObjectID = 'YOUR_OBJECT_ID';

frequentlyBoughtTogether({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      <pre>
        <code>{JSON.stringify(item)}</code>
      </pre>
    );
  },
});

relatedProducts({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      <pre>
        <code>{JSON.stringify(item)}</code>
      </pre>
    );
  },
});
```

### For [React](/packages/recommend-react)

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

Continue reading our [**Getting Started**](https://www.algolia.com/doc/ui-libraries/recommend/introduction/getting-started/#displaying-recommendations) guide.

## Documentation

The [documentation](https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/) offers a few ways to learn about the Recommend library:

- Follow the [**Building your Recommend UI guide**](https://www.algolia.com/doc/guides/algolia-ai/recommend/#building-your-recommendation-ui) to display recommendations on your website.
- Refer to the [**JavaScript API reference**](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/) or [**React API reference**](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-react/) for a comprehensive list of parameters and options.
- Try out the [**Playground**](https://codesandbox.io/s/github/algolia/recommend/tree/next/examples/playground?file=/app.tsx) where you can fork a basic implementation and play around.

You can find more on the [documentation](https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/).

## Support

- [GitHub Discussions](https://github.com/algolia/recommend/discussions)

## Packages

- [`@algolia/recommend-core`](/packages/recommend-core): Core package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/)
- [`@algolia/recommend-js`](/packages/recommend-js): JavaScript package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/)
- [`@algolia/recommend-react`](/packages/recommend-react): React package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/)
- [`@algolia/recommend-vdom`](/packages/recommend-vdom): VDOM package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/)

## License

[MIT](LICENSE)
