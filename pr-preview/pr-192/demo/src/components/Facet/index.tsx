import { TrendingFacetHit } from '@algolia/recommend';
import React from 'react';

import './style.css';

type FacetProps = {
  hit: TrendingFacetHit;
  indexName: string;
  onSelect(hit: TrendingFacetHit): void;
};

export function Facet({ hit, onSelect }: FacetProps) {
  return (
    <div
      className="Hit"
      onClick={(event) => {
        event.preventDefault();
        onSelect(hit);
      }}
    >
      <div className="Facet-Content">
        <div className="Facet-Value">{hit.facetValue}</div>
      </div>
    </div>
  );
}
