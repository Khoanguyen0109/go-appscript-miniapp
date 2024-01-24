import { axiosInstance } from "api/instance";
import { atom, selector } from "recoil";
import { Product } from "types/product";

export const selectedProductState = atom<Product | null>({
  key: "selectedProduct",
  default: null,
});
