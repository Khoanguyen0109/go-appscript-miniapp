import { Product } from "./product";

export type SelectedOptions = Record<string, string | string[]>;

export interface CartItem {
  product: Product;
  options: SelectedOptions;
  quantity: number;
  selected: boolean
}

export type Cart = CartItem[];
