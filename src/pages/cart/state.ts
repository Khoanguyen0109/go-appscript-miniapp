import { atom } from "recoil";

export const noteState = atom({
  key: "note",
  default: "",
});

export const selectedPaymentMethod = atom({
  key: "selectedPaymentMethod",
  default: null,
});

export const addressSelectedState = atom({
  key: "addressSelectedState",
  default: null,
});
