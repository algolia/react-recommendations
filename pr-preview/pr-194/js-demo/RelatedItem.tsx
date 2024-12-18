/** @jsxRuntime classic */
/** @jsx h */
import { h } from 'preact';

import { RelatedItemProps } from './types';

export function RelatedItem({ item, insights, onSelect }: RelatedItemProps) {
  return (
    <a
      className="RelatedItem grid gap-2 color-inherit no-underline"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();
        onSelect(item);
        insights('clickedObjectIDsAfterSearch', {
          objectIDs: [item.objectID],
          eventName: 'Product Clicked',
          index: item.__indexName,
          positions: [item.__position],
          queryID: item.__queryID,
        });
      }}
    >
      <div className="relative">
        <img src={item.image_urls[0]} alt={item.name} className="max-w-full" />

        <div className="RelatedItem-info">
          {item._score && (
            <div
              className="flex items-center absolute right-0 top-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2"
              style={{ background: 'rgb(255 255 255 / 92%)' }}
            >
              <svg className="inline-block mr-1" width="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.984 9.984h2.016v4.031h-2.016v-4.031zM15 18v-12h2.016v12h-2.016zM3 14.016v-4.031h2.016v4.031h-2.016zM11.016 21.984v-19.969h1.969v19.969h-1.969zM6.984 18v-12h2.016v12h-2.016z"
                ></path>
              </svg>
              {item._score}
            </div>
          )}
          <div
            className="flex items-center absolute right-0 bottom-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2"
            style={{ background: 'rgb(255 255 255 / 92%)' }}
          >
            {item.objectID}
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500">{item.brand}</div>

        <div className="text-gray-900 font-semibold mb-1 whitespace-normal clamp-1">
          {item.name}
        </div>

        {Boolean(item.reviews.count) && (
          <div className="items-center flex flex-grow text-sm text-gray-700">
            <svg
              className="mr-1 text-orange-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="mr-1">
              {item.reviews.bayesian_avg.toFixed(1) || '--'}
            </span>
            <span className="text-gray-400">
              ({item.reviews.count} reviews)
            </span>
          </div>
        )}

        <div className="my-2 font-semibold text-gray-800">
          {item.price.value} {item.price.currency}
        </div>

        <button
          className="flex items-center justify-center w-full bg-white border-nebula-500 border-solid border rounded text-nebula-900 cursor-pointer py-1 px-2 font-semibold"
          onClick={(event) => {
            event.preventDefault();

            insights('convertedObjectIDsAfterSearch', {
              objectIDs: [item.objectID],
              eventName: 'Product Added To Cart',
              queryID: item.__queryID,
              index: item.__indexName,
            });
          }}
        >
          Add to cart
        </button>
      </div>
    </a>
  );
}
