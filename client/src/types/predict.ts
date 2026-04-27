export interface PredictionEntities {
  category?: string;
  target?: string;
  price_max?: number;
  brand?: string;
  budget_max?: number;
  campaign_name?: string;
}

export interface PredictionIntent {
  intent:
    | "product_search"
    | "audience_search"
    | "campaign_search"
    | "performance_query"
    | "unknown";
  entities: PredictionEntities;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string | number;
  brand: string;
  createdAt: string;
  updatedAt: string;
}

export interface Audience {
  id: string;
  name: string;
  age_range: string;
  preferences: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  budget: string | number;
  product_id: string;
  audience_id: string;

  product?: Product;
  audience?: Audience;
  createdAt: string;
  updatedAt: string;
}

export interface Performance {
  id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  campaign_id: string;

  campaign?: Campaign;
  createdAt: string;
  updatedAt: string;
}

export type QueryDataResult =
  | Product[]
  | Audience[]
  | Campaign[]
  | Performance[];

export interface PredictResponse {
  structured_output: PredictionIntent;
  retrieved_data: QueryDataResult;
}
