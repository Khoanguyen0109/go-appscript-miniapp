import { atom } from "recoil";

export const noteState = atom({
  key: "note",
  default: "",
});

export const selectedPaymentMethod = atom({
  key: "selectedPaymentMethod",
  default: {
    id: 0,
    label: "COD",
    value: "cod",
    subtitle: "Thanh toán khi nhận hàng",
  },
});

export const addressSelectedState = atom({
  key: "addressSelectedState",
  default: null,
});
