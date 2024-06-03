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

# `@algolia/recommend-js`

JavaScript package for [Algolia Recommend](https://www.algolia.com/doc/guides/algolia-ai/recommend/).

## Installation

All Recommend packages are available on the [npm](https://www.npmjs.com/) registry.

```bash
yarn add @algolia/recommend-js
# or
npm install @algolia/recommend-js
```

## Usage

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

Continue reading our [**Getting Started**](https://www.algolia.com/doc/ui-libraries/recommend/introduction/getting-started/?client=JavaScript) guide.

## Documentation

The [documentation](https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/) offers a few ways to learn about the Recommend library:

- Follow the [**Building your Recommend UI guide**](https://www.algolia.com/doc/guides/algolia-ai/recommend/?client=js#building-your-recommendation-ui) to display recommendations on your website.
- Refer to the [**API reference**](https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/) for a comprehensive list of parameters and options.
