import { CategoryId } from "./category";

export interface PercentSale {
  type: "percent";
  percent: number;
}

export interface FixedSale {
  amount: number;
  type: "fixed";
}

export type Sale = PercentSale | FixedSale;

export interface Option {
  key: string;
  label?: string;
  priceChange?: Sale;
}

export interface BaseVariant {
  key: string;
  label?: string;
  options: Option[];
}

export interface SingleOptionVariant extends BaseVariant {
  type: "single";
  default?: string;
}

export interface MultipleOptionVariant extends BaseVariant {
  type: "multiple";
  default?: string[];
}

export type Variant = SingleOptionVariant | MultipleOptionVariant;

export interface Product {
  id: string;
  name: string;
  thumbnail: string;
  image: string;
  price: number;
  categoryId: string;
  desc: string;
  active: string;
  created_at: string;
  inventories: TProductInventory[];
  has_inventories: string;
  descThumbnail: string;
  banner_image?: string;
  costdown?: string;
  discount?: string;
  rating?: number;
}

export type TProductInventory = {};
