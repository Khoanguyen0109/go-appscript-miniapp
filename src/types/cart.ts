import { Product } from "./product";

export type SelectedOptions = Record<string, string | string[]>;

export interface CartItem {
  product: Product;
  options: SelectedOptions;
  inventory_id?: string;
  quantity: number;
  selected: boolean;
}

export type Cart = CartItem[];
