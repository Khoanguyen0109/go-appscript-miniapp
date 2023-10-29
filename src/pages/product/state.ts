import { axiosInstance } from "api/instance";
import { atom, selector } from "recoil";

export const selectedProductIdState = atom({
    key: "selectedProductId",
    default: null,
  });

  export const productDetailState = selector({
    key: "productDetail",
    get:async ({ get })  => {
        const productId = get(selectedProductIdState)
        const res = await axiosInstance(`/products/${productId}`)
        return res.data.data
    }
  })