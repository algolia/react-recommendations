/** @jsxRuntime classic */
/** @jsx h */
import { TrendingFacetHit } from '@algolia/recommend';
import { h } from 'preact';

export function Facet({ hit }: { hit: TrendingFacetHit }) {
  return (
    <div className="Hit">
      <div className="Facet-Content">
        <div className="Facet-Value">{hit.facetValue}</div>
      </div>
    </div>
  );
}
