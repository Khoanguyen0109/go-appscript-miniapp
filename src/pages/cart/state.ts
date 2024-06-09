import { atom } from "recoil";
import { addressesState } from "../user/state";

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
  default: addressesState?.[0] || null,
});

export const dateSelectedState = atom({
  key: "dateSelectedState",
  default: new Date(),
});

export const timeSelectedState = atom({
  key: "timeSelectedState",
  default: null,
});

export const voucherSelectedState = atom({
  key: "voucherSelectedState",
  default: null,
});
