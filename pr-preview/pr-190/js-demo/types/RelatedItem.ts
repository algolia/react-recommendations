import { InsightsClient } from 'search-insights';

import { ProductHit } from './ProductHit';

export type RelatedItemProps = {
  item: ProductHit;
  insights: InsightsClient;
  onSelect(hit: ProductHit): void;
};
