function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},i={},n=t.parcelRequiree2f3;null==n&&((n=function(e){if(e in o)return o[e].exports;if(e in i){var t=i[e];delete i[e];var n={id:e,exports:{}};return o[e]=n,t.call(n.exports,n,n.exports),n.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){i[e]=t},t.parcelRequiree2f3=n);var r=n("ayDL8"),m=n("3mMCR"),a=n("9gw4x"),d=n("e74rp"),l=n("6WZt4"),s=n("bihYt"),c=n("4L34W");function h({item:e,html:t}){return t`<div className="ProductItem grid gap-2">
    <div className="relative">
      <img
        src="${e.image_urls[0]}"
        alt="${e.name}"
        className="max-w-full"
      />

      <div className="ProductItem-info">
        ${e._score&&t`<div
          className="flex items-center absolute right-0 top-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2"
        >
          <svg className="inline-block mr-1" width="18" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M18.984 9.984h2.016v4.031h-2.016v-4.031zM15 18v-12h2.016v12h-2.016zM3 14.016v-4.031h2.016v4.031h-2.016zM11.016 21.984v-19.969h1.969v19.969h-1.969zM6.984 18v-12h2.016v12h-2.016z"
            ></path>
          </svg>
          ${e._score}
        </div>`}
        <div
          className="flex items-center absolute right-0 bottom-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2"
        >
          ${e.objectID}
        </div>
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-500">${e.brand}</div>

      <div className="text-gray-900 font-semibold mb-1 whitespace-normal">
        ${e.name}
      </div>
      ${Boolean(e.reviewScore)&&t`<div className="items-center flex flex-grow text-sm text-gray-700">
        <svg
          className="mr-1 text-orange-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>

        <span className="mr-1">${e.reviewScore.toFixed(1)||"--"}</span>

        <span className="text-gray-400">(${e.reviewCount} reviews)</span>
      </div>`}
      <div className="my-2 font-semibold text-gray-800">
        ${e.price.value} ${e.price.currency}
      </div>

      <button
        className="flex items-center justify-center w-full bg-white border-nebula-500 border-solid border rounded text-nebula-900 cursor-pointer py-1 px-2 font-semibold"
        onClick=${e=>{e.preventDefault()}}
      >
        Add to cart
      </button>
    </div>
  </div>`}const p=e(r)("93MWK2GLFE","63a2f2cf276ced37f901d8612ce5b40c");(0,m.frequentlyBoughtTogether)({container:"#frequentlyBoughtTogether",recommendClient:p,indexName:"prod_ECOM",objectIDs:["M0E20000000EAAK"],headerComponent:({html:e})=>e`<h3>Frequently bought together</h3>`,itemComponent:h}),(0,d.relatedProducts)({container:"#relatedProducts",recommendClient:p,indexName:"prod_ECOM",objectIDs:["M0E20000000EAAK"],headerComponent:({html:e})=>e`<h3>Related products</h3>`,itemComponent:h,view:({items:e,itemComponent:t,...o})=>(0,c.horizontalSlider)({items:e,itemComponent:({item:e})=>t({item:e,...o})})||o.html`<div>Loading</div>`}),(0,a.lookingSimilar)({container:"#lookingSimilar",recommendClient:p,indexName:"prod_ECOM",objectIDs:["M0E20000000EAAK"],headerComponent:({html:e})=>e`<h3>Looking similar</h3>`,itemComponent:h,view:({items:e,itemComponent:t,...o})=>(0,c.horizontalSlider)({items:e,itemComponent:({item:e})=>t({item:e,...o})})||o.html`<div>Loading</div>`}),(0,s.trendingItems)({container:"#trendingItems",recommendClient:p,indexName:"prod_ECOM",headerComponent:({html:e})=>e`<h3>Trending items</h3>`,itemComponent:h,view:({items:e,itemComponent:t,...o})=>(0,c.horizontalSlider)({items:e,itemComponent:({item:e})=>t({item:e,...o})})||o.html`<div>Loading</div>`}),(0,l.trendingFacets)({container:"#trendingFacets",recommendClient:p,indexName:"prod_ECOM",facetName:"brand",maxRecommendations:5,headerComponent:({html:e})=>e`<h3>Trending facets</h3>`,itemComponent:({item:e,html:t})=>t`<p>${e.facetValue}</p>`});
//# sourceMappingURL=index.4517676f.js.map
