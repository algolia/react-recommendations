import { Hit } from '@algolia/client-search';

export type ProductRecord = {
  brand: string;
  image_urls: string[];
  hierarchical_categories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
  };
  name: string;
  price: {
    value: number;
    currency: string;
    discount_level: number;
    discounted_value: number;
    on_sales: boolean;
  };
  _score: number;
  reviews: {
    bayesian_avg: number;
    count: number;
    rating: number;
  };
  url: string;
};

type WithInsights<THit> = THit & {
  __position: string;
  __indexName: string;
  __queryID: string;
};

export type ProductHit = WithInsights<Hit<ProductRecord>>;
