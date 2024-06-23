import { atom, selector } from "recoil";
import { addressesState } from "../user/state";
import { selectedDeliveryTimeState } from "../../state";
import { DateTime } from "luxon";

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

export const dateSelectedState = selector({
  key: "dateSelectedState",
  get: ({ get }) => {
    const timestamp = get(selectedDeliveryTimeState);
    const localDateOnly = DateTime.fromMillis(timestamp).toLocaleString({
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return localDateOnly;
  },
});

export const timeSelectedState = selector({
  key: "timeSelectedState",
  get: ({ get }) => {
    const timestamp = get(selectedDeliveryTimeState);
    const localTimeOnly = DateTime.fromMillis(timestamp).toLocaleString(
      DateTime.TIME_SIMPLE
    );

    return localTimeOnly;
  },
});

export const voucherSelectedState = atom({
  key: "voucherSelectedState",
  default: null,
});
