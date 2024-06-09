import { atom, selector } from "recoil";
import { EOrderStatus } from "../constantsapp";
import { userState } from "../state";
import supabase from "../client/client";

export const selectedShippingStatusState = atom({
  key: "selectedShippingStatusState",
  default: "waiting",
});

export const shippingListSelector = selector({
  key: "shippingListSelector",
  get: async ({ get }) => {
    try {
      const user = get(userState);
      const { data } = await supabase.rpc("get_shipper_order", {
        shipperIdParams: user.id,
      });
      return data;
    } catch (error) {
      console.log("error", error);
      return [];
    }
  },
});

export const shippingListState = atom({
  key: "shippingListState",
  default: shippingListSelector,
});

export const shippingListSelectorByStatus = selector({
  key: "shippingListSelectorByStatus",
  get: ({ get }) => {
    const currentStatus = get(selectedShippingStatusState);
    const shippingList = get(shippingListState);
    console.log("shippingList", shippingList);
    const orders = shippingList?.filter(
      (item) => item.status === currentStatus
    );
    return orders;
  },
});

export const shippingDetailSelected = atom({
  key: "shippingDetailSelected",
  default: null,
});

export const shippingDetailSelector = selector({
  key: "shippingDetailSelector",
  get: async ({ get }) => {
    const selected = get(shippingDetailSelected);
    console.log("selected", selected);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", selected.id);
    console.log("error", error);
    return data || {};
  },
});

export const shippingDetailState = atom({
  key: "shippingDetailState",
  default: shippingDetailSelector,
});
